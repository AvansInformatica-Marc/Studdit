import { Server } from "@peregrine/webserver"

import { env } from "./config"
import { PostController } from "./controllers/postController"
import { MongoDB } from "./database/mongoDB"
import { MongoDBInstance } from "./database/mongoDBInstance"
import { PostRepository } from "./repositories/postRepository"

const startDatabase = async () => {
    const db = new MongoDB(env.db.name)

    return db.connect(env.db.host, env.db.port || null, "DEFAULT", env.db.user, env.db.password)
}

const startServer = async (dbConnection: MongoDBInstance) => {
    const server = new Server()
    server.addController("/api/v1/", new PostController(new PostRepository(dbConnection)))

    return server.startWithoutSecurity(env.port)
}

// Run the app
const main = async () => {
    const dbConnection = await startDatabase()
    console.log(`Connected to MongoDB on ${dbConnection.connectionString}`)

    const connectionInfo = await startServer(dbConnection)
    console.log(`Server is running on http://localhost:${connectionInfo.port}/`)
}

main()
    .catch(error => {
        console.error(error)
    })