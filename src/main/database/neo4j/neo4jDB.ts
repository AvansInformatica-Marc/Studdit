import { JsonObject } from "@peregrine/webserver"
import { v1 as neo4j } from "neo4j-driver"

import { IGraphDB } from "../graphDB"

export class Neo4J implements IGraphDB<neo4j.StatementResult> {
    public readonly driver: neo4j.Driver

    public constructor(public readonly connectionString: string, credentials?: [string, string]) {
        const auth = credentials !== undefined ? neo4j.auth.basic(credentials[0], credentials[1]) : undefined
        this.driver = neo4j.driver(connectionString, auth)
    }

    public closeConnection() {
        this.driver.close()
    }

    public async run(query: string, params?: JsonObject): Promise<neo4j.StatementResult> {
        const session = this.driver.session()
        const result = await session.run(query, params)
        session.close()

        return result
    }
}