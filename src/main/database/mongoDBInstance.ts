import mongoose from "mongoose"

export class MongoDBInstance {
    public constructor(public readonly connection: mongoose.Connection, public readonly connectionString: string) {}
}
