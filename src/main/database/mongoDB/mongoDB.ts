import { JsonObject } from "@peregrine/webserver"
import mongoose from "mongoose"

import { MongoRepository } from "./mongoRepository"
import { IConstructor } from "../../constructorType";

mongoose.Promise = global.Promise

export class MongoDB {
    public static DEFAULT_PORT = 27017

    public static async connect(dbName: string, conString: string, retryWrites: boolean = false): Promise<MongoDB> {
        const connectionUri = `${conString}/${dbName}?retryWrites=${retryWrites}`

        const mongoConnection = mongoose.createConnection(connectionUri, {
            useCreateIndex: true,
            useNewUrlParser: true,
        })

        return new Promise((resolve, reject) => {
            mongoConnection
                .once("open", () => { resolve(new MongoDB(mongoConnection, connectionUri, dbName)) })
                .on("error", reject)
        })
    }

    public static createConnectionString(
        host: string = "localhost",
        port: number | string | null = MongoDB.DEFAULT_PORT,
        protocol: "DEFAULT" | "SRV" = "DEFAULT",
        user?: string,
        password?: string,
    ): string {
        const connectionProtocol = protocol === "DEFAULT" ? "mongodb" : "mongodb+srv"
        const credentials = user !== undefined && password !== undefined ? `${user}:${password}@` : ""
        const connectionPort = port !== null ? `:${port}` : ""

        return `${connectionProtocol}://${credentials}${host}${connectionPort}`
    }

    public constructor(
        protected readonly connection: mongoose.Connection,
        public readonly connectionString: string,
        public readonly databaseName: string,
    ) {}

    public createRepository<T extends object>(object: IConstructor<T>): MongoRepository<T> {
        return new MongoRepository<T>(object, this)
    }

    public model<T>(name: string, schema: mongoose.SchemaDefinition): mongoose.Model<T & mongoose.Document> {
        if (schema._id !== undefined){
            schema._id = (schema._id as JsonObject).type
        }

        return this.connection.model(name, new mongoose.Schema(schema), name)
    }
}