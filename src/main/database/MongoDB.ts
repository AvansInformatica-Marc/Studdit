import mongoose from "mongoose"

import { MongoDBInstance } from "./mongoDBInstance"

mongoose.Promise = global.Promise

export class MongoDB {
    public static DEFAULT_PORT = 27017
    public static INSTANCE = MongoDBInstance
    public static TYPES = mongoose.SchemaTypes

    public static schemaOf(json: mongoose.SchemaDefinition): mongoose.Schema {
        return new mongoose.Schema(json, { versionKey: false })
    }

    public constructor(protected readonly dbName: string) {}

    public async connect(
        host: string = "localhost",
        port: number | string | null = MongoDB.DEFAULT_PORT,
        protocol: "DEFAULT" | "SRV" = "DEFAULT",
        user?: string,
        password?: string,
        retryWrites?: boolean,
    ): Promise<MongoDBInstance> {
        const connectionProtocol = protocol === "DEFAULT" ? "mongodb" : "mongodb+srv"
        const credentials = user !== undefined && password !== undefined ? `${user}:${password}@` : ""
        const connectionPort = port !== null ? `:${port}` : ""

        return this.connectWithConnectionString(
            `${connectionProtocol}://${credentials}${host}${connectionPort}`, retryWrites)
    }

    public async connectWithConnectionString(
        connectionString: string,
        retryWrites: boolean = false,
    ): Promise<MongoDBInstance> {
        const connectionUri = `${connectionString}/${this.dbName}${retryWrites ? "?retryWrites=true" : ""}`

        return new Promise(async (resolve, reject) => {
            const mongoConnection = await mongoose.connect(connectionUri, {
                useCreateIndex: true,
                useNewUrlParser: true,
            })

            const instance = new MongoDB.INSTANCE(mongoConnection.connection, connectionUri)

            instance.connection
                .once("open", () => { resolve(instance) })
                .on("error", reject)
        })
    }
}