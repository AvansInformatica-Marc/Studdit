import { File } from "@peregrine/filesystem"
import { Server } from "@peregrine/webserver"

import { CommentController } from "./controllers/commentController"
import { ThreadController } from "./controllers/threadController"
import { MongoDB } from "./database/mongoDB/mongoDB"
import { MongoRepository } from "./database/mongoDB/mongoRepository"
import { Comment } from "./models/comment"
import { Thread } from "./models/thread"
import { User } from "./models/user"

const isProduction = process.env.PORT !== undefined

if (!isProduction) {
    require("dotenv").config()
}

const startDatabase = async (): Promise<MongoDB> => {
    const connectionString = MongoDB.createConnectionString(
        process.env.MDB_HOST, null, "SRV", process.env.MDB_USER, process.env.MDB_PASSWORD)

    return MongoDB.connect("studdit", connectionString, true)
}

const startServer = async (dbConnection: MongoDB) => {
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
        if (user.password !== request.headers.password || !user.isActive) {
            return null
        }

        return user
    })
    apiEndpoint.addController(new ThreadController(threadRepository, commentRepository))
    apiEndpoint.addController(new CommentController(threadRepository, commentRepository))

    return isProduction ?
        server.startWithoutSecurity(process.env.PORT) :
        server.start(new File("assets/localhost.key"), new File("assets/localhost.crt"), process.env.PORT)
}

// Run the app
const main = async () => {
    const dbConnection = await startDatabase()
    const connectionString = dbConnection.connectionString.replace(process.env.MDB_PASSWORD as string, "******")
    console.log(`Connected to MongoDB on ${connectionString}`)

    const connectionInfo = await startServer(dbConnection)
    console.log(`Server is running on https://localhost:${connectionInfo.port}/`)
}

main()
    .catch(error => {
        console.error(error)
    })