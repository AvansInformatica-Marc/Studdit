import mongoose from "mongoose"

import { MongoDBInstance } from "./mongoDBInstance"

mongoose.Promise = global.Promise

export class MongoDB {
    public static DEFAULT_PORT = 27017
    public static INSTANCE = MongoDBInstance
    public static TYPES = mongoose.SchemaTypes

    public static schemaOf(json: {[name: string]: any}): mongoose.Schema {
        return new mongoose.Schema(json, { versionKey: false })
    }

    public constructor(protected readonly dbName: string) {}

    public async connect(
        host: string = "localhost",
        port: number | string | null = MongoDB.DEFAULT_PORT,
        user?: string,
        password?: string,
    ): Promise<MongoDBInstance> {
        let connectionString = ""
        connectionString += host === "localhost" ? "mongodb://" : "mongodb+srv://"
        if (user && password) {
            connectionString += `${user}:${password}@`
        }
        connectionString += host
        if (port) {
            connectionString += `:${port}`
        }

        return this.connectWithConnectionString(connectionString)
    }

    public async connectWithConnectionString(
        connectionString: string,
        retryWrites: boolean = false,
    ): Promise<MongoDBInstance> {
        connectionString += "/" + this.dbName + (retryWrites ? "?retryWrites=true" : "")

        return new Promise(async (resolve, reject) => {
            await mongoose.connect(connectionString, {
                useCreateIndex: true,
                useNewUrlParser: true,
            })

            const instance = new MongoDB.INSTANCE(mongoose.connection, connectionString)

            instance.connection
                .once("open", () => resolve(instance))
                .on("error", (error: Error) => reject(error))
        })
    }
}