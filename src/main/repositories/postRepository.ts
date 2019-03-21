import { MongoDB } from "../database/mongoDB"
import { MongoDBInstance } from "../database/mongoDBInstance"
import { MongoRepository } from "../database/mongoRepository"
import { IPost } from "../models/post"

const types = MongoDB.TYPES

export class PostRepository extends MongoRepository<IPost> {
    public constructor(instance?: MongoDBInstance) {
        super("posts", {
            /* customerId: {
                type: types.Number,
                unique: true,
                required: true,
            },
            slack: {
                type: types.String,
                unique: false,
                required: false,
            }, */
        }, instance)
    }
}