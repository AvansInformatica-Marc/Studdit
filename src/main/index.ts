import { File } from "@peregrine/filesystem"
import { Server } from "@peregrine/webserver"

import { CommentController } from "./controllers/commentController"
import { FriendshipController } from "./controllers/friendshipController"
import { ThreadController } from "./controllers/threadController"
import { UserController } from "./controllers/userController"
import { MongoDB } from "./database/mongoDB/mongoDB"
import { MongoRepository } from "./database/mongoDB/mongoRepository"
import { Neo4J } from "./database/neo4j/neo4jDB"
import { Comment } from "./models/comment"
import { Thread } from "./models/thread"
import { User } from "./models/user"

const isProduction = process.env.PORT !== undefined

if (!isProduction) {
    require("dotenv").config()
}

const startMongoDatabase = async (): Promise<MongoDB> => {
    const connectionString = MongoDB.createConnectionString(
        process.env.MDB_HOST, null, "SRV", process.env.MDB_USER, process.env.MDB_PASSWORD)

    return MongoDB.connect("studdit", connectionString, true)
}

const startNeo4j = (): Neo4J => new Neo4J(
    process.env.NEO_CONNECTIONSTRING as string,
    [process.env.NEO_USER as string, process.env.NEO_PASSWORD as string],
)

const startServer = async (dbConnection: MongoDB, neo4jConnection: Neo4J) => {
    const commentRepository = new MongoRepository(Comment, dbConnection)
    const threadRepository = new MongoRepository(Thread, dbConnection)
    const userRepository = new MongoRepository(User, dbConnection)

    const server = new Server()
    const apiEndpoint = server.route("/api/v1/")
    apiEndpoint.addAuthenticationMiddleware(async request => {
        if (request.headers.username === undefined) {
            return null
        }

        const user = await userRepository.getById(request.headers.username as string)
        if (user === null || user.password !== request.headers.password || !user.isActive) {
            return null
        }

        return user
    })
    apiEndpoint.addController(new ThreadController(threadRepository, commentRepository))
    apiEndpoint.addController(new CommentController(threadRepository, commentRepository))
    apiEndpoint.addController(new UserController(userRepository, neo4jConnection))
    apiEndpoint.addController(new FriendshipController(neo4jConnection))

    if (!isProduction && process.env.PORT === "443") {
        return server.start(new File("assets/localhost.key"), new File("assets/localhost.crt"), process.env.PORT)
    }

    return server.startWithoutSecurity(process.env.PORT)
}

let neo4jDatabase: Neo4J
let mongoDatabase: MongoDB

// Run the app
const main = async () => {
    mongoDatabase = await startMongoDatabase()
    const connectionString = mongoDatabase.connectionString.replace(process.env.MDB_PASSWORD as string, "******")
    console.log(`Connected to MongoDB on ${connectionString}`)

    neo4jDatabase = startNeo4j()
    console.log(`Connected to Neo4j on ${neo4jDatabase.connectionString}`)

    const connectionInfo = await startServer(mongoDatabase, neo4jDatabase)
    console.log(`Server is running on https://localhost:${connectionInfo.port}/`)
}

main()
    .catch(error => {
        console.error(error)
    })

process.on("exit", async () => {
    process.stdin.resume()
    console.log("Closing database connections")
    neo4jDatabase.closeConnection()
    await mongoDatabase.closeConnection()
    process.exit(2)
})

process.on("SIGINT", async () => {
    process.stdin.resume()
    console.log("Closing database connections")
    neo4jDatabase.closeConnection()
    await mongoDatabase.closeConnection()
    process.exit(2)
})

process.on("SIGTERM", async () => {
    process.stdin.resume()
    console.log("Closing database connections")
    neo4jDatabase.closeConnection()
    await mongoDatabase.closeConnection()
    process.exit(2)
})