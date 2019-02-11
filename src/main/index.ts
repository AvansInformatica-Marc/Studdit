import { Server } from "@peregrine/webserver"
import { MongoDB } from "./database/MongoDB";
import { DealController } from "./controllers/DealController";
import { ContactPersonController } from "./controllers/ContactPersonController";
import { CustomerController } from "./controllers/CustomerController";
import { CustomerRepository } from "./repositories/CustomerRepository";
import { env } from "./config"

async function startServer(){
    const server = new Server()
    server.addController(`/api/v1/`, new DealController())
    server.addController(`/api/v1/`, new ContactPersonController())
    server.addController(`/api/v1/`, new CustomerController(new CustomerRepository()))

    const connectionInfo = await server.startWithoutSecurity(env.port)
    console.log(`Server is running on http://localhost:${connectionInfo.port}/`)
}

async function startDatabase(){
    const db = new MongoDB(env.db.name);

    const dbConnection = await db.connect(env.db.host, env.db.port || null, env.db.user, env.db.password)
    console.log(`Connected to MongoDB on ${dbConnection.connectionString}`)
}

// Run the app
(async () => {
    await startDatabase()
    await startServer()
})()