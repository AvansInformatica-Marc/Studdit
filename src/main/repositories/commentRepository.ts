import { MongoDB } from "../database/mongoDB"
import { MongoDBInstance } from "../database/mongoDBInstance"
import { MongoRepository } from "../database/mongoRepository"
import { IComment } from "../models/comment"

const types = MongoDB.TYPES

export class CommentRepository extends MongoRepository<IComment> {
    public constructor(instance?: MongoDBInstance) {
        super("comments", {
            parentId: {
                type: types.ObjectId,
                unique: false,
                required: true,
            },
            userId: {
                type: types.ObjectId,
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