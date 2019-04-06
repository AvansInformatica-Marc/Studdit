import { File } from "@peregrine/filesystem"
import { Server } from "@peregrine/webserver"

import { CommentController } from "./controllers/commentController"
import { ThreadController } from "./controllers/threadController"
import { MongoDB } from "./database/mongoDB/mongoDB"
import { CommentRepository } from "./repositories/commentRepository"
import { ThreadRepository } from "./repositories/threadRepository"

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
    const server = new Server()
    const commentRepository = new CommentRepository(dbConnection)
    server.addController("/api/v1/", new ThreadController(new ThreadRepository(dbConnection), commentRepository))
    server.addController("/api/v1/", new CommentController(commentRepository))

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