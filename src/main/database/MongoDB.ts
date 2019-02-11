import mongoose from 'mongoose'

mongoose.Promise = global.Promise

class MongoDBInstance {
    constructor(public readonly connection: mongoose.Connection, public readonly connectionString: string){}
}

export class MongoDB {
    public static Instance = MongoDBInstance
    public static Types = mongoose.SchemaTypes
    public static DefaultPort = 27017

    constructor(protected readonly dbName: string){}
    
    public connect(host: string = "localhost", port: number | string | null = MongoDB.DefaultPort, user?: string, password?: string): Promise<MongoDBInstance> {
        let connectionString = ""
        connectionString += host == "localhost" ? "mongodb://" : "mongodb+srv://"
        if(user && password) connectionString += `${user}:${password}@`
        connectionString += host
        if(port) connectionString += ":" + port

        return this.connectWithConnectionString(connectionString)
    }

    public connectWithConnectionString(connectionString: string, retryWrites: boolean = false): Promise<MongoDBInstance> {
        connectionString += "/" + this.dbName + (retryWrites ? "?retryWrites=true" : "")
        return new Promise((resolve, reject) => {
            mongoose.connect(connectionString, {
                useCreateIndex: true,
                useNewUrlParser: true
            })
        
            const instance = new MongoDB.Instance(mongoose.connection, connectionString)

            instance.connection
                .once('open', () => resolve(instance))
                .on('error', (error: Error) => reject(error))
        })
    }

    public static schemaOf(json: {[name: string]: any}): mongoose.Schema {
        return new mongoose.Schema(json, { versionKey: false })
    }
}