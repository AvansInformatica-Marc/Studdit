import { File } from "@peregrine/filesystem"
import { Server } from "@peregrine/webserver"

import { env } from "./config"
import { CommentController } from "./controllers/commentController"
import { ThreadController } from "./controllers/threadController"
import { MongoDB } from "./database/mongoDB"
import { MongoDBInstance } from "./database/mongoDBInstance"
import { CommentRepository } from "./repositories/commentRepository"
import { ThreadRepository } from "./repositories/threadRepository"

const startDatabase = async () => {
    const db = new MongoDB(env.db.name)

    return db.connect(env.db.host, env.db.port, env.db.protocol, env.db.user, env.db.password)
}

const startServer = async (dbConnection: MongoDBInstance) => {
    const server = new Server()
    server.addController("/api/v1/", new ThreadController(new ThreadRepository(dbConnection)))
    server.addController("/api/v1/", new CommentController(new CommentRepository(dbConnection)))

    return env.production ?
        server.startWithoutSecurity(env.port) :
        server.start(new File("assets/localhost.key"), new File("assets/localhost.crt"), env.port)
}

// Run the app
const main = async () => {
    const dbConnection = await startDatabase()
    console.log(`Connected to MongoDB on ${dbConnection.connectionString}`)

    const connectionInfo = await startServer(dbConnection)
    console.log(`Server is running on https://localhost:${connectionInfo.port}/`)
}

main()
    .catch(error => {
        console.error(error)
    })