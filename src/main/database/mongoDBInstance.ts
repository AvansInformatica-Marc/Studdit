import mongoose from "mongoose"

import { MongoDB } from "./mongoDB"
import { MongoRepository } from "./mongoRepository"

export class MongoDBInstance {
    public constructor(public readonly connection: mongoose.Connection, public readonly connectionString: string) {}

    public createRepository<T>(name: string, schema: mongoose.SchemaDefinition): MongoRepository<T> {
        return new MongoRepository<T>(name, schema, this)
    }

    public model<T>(name: string, schema: mongoose.SchemaDefinition): mongoose.Model<T & mongoose.Document> {
        return this.connection.model(name, MongoDB.schemaOf(schema), name)
    }
}
