import { MongoDB } from "../database/mongoDB"
import { MongoDBInstance } from "../database/mongoDBInstance"
import { MongoRepository } from "../database/mongoRepository"
import { IThread } from "../models/thread"

const types = MongoDB.TYPES

export class ThreadRepository extends MongoRepository<IThread> {
    public constructor(instance?: MongoDBInstance) {
        super("threads", {
            userId: {
                type: types.ObjectId,
                unique: false,
                required: true,
            },
            title: {
                type: types.String,
                unique: false,
                required: true,
            },
            content: {
                type: types.String,
                unique: false,
                required: true,
            },
        }, instance)
    }
}