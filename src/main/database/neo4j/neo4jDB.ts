import { JsonObject } from "@peregrine/webserver"
import { v1 as neo4j } from "neo4j-driver"

import { IGraphDB } from "../graphDB"

export type Record = neo4j.Record

export class Neo4J implements IGraphDB<Record[]> {
    public readonly driver: neo4j.Driver
    public readonly session: neo4j.Session

    public constructor(public readonly connectionString: string, credentials?: [string, string]) {
        const auth = credentials !== undefined ? neo4j.auth.basic(credentials[0], credentials[1]) : undefined
        this.driver = neo4j.driver(connectionString, auth)
        this.session = this.driver.session()
    }

    public closeConnection() {
        this.session.close()
        this.driver.close()
    }

    public async run(query: string, params?: JsonObject): Promise<Record[]> {
        return (await this.session.run(query, params)).records
    }
}