import { Server } from "@peregrine/webserver"

import { env } from "./config"
import { ContactPersonController } from "./controllers/contactPersonController"
import { CustomerController } from "./controllers/customerController"
import { DealController } from "./controllers/dealController"
import { MongoDB } from "./database/mongoDB"
import { CustomerRepository } from "./repositories/customerRepository"

const startServer = async () => {
    const server = new Server()
    server.addController("/api/v1/", new DealController())
    server.addController("/api/v1/", new ContactPersonController())
    server.addController("/api/v1/", new CustomerController(new CustomerRepository()))

    return server.startWithoutSecurity(env.port)
}

const startDatabase = async () => {
    const db = new MongoDB(env.db.name)

    return db.connect(env.db.host, env.db.port || null, env.db.user, env.db.password)
}

// Run the app
const main = async () => {
    const dbConnection = await startDatabase()
    console.log(`Connected to MongoDB on ${dbConnection.connectionString}`)

    const connectionInfo = await startServer()
    console.log(`Server is running on http://localhost:${connectionInfo.port}/`)
}

main()
    .catch(error => {
        console.error(error)
    })