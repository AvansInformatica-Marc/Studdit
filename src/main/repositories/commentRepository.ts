import { MongoDB } from "../database/mongoDB/mongoDB"
import { MongoRepository } from "../database/mongoDB/mongoRepository"
import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"

export class CommentRepository extends MongoRepository<Comment> implements IRepository<Comment> {
    public constructor(instance: MongoDB) {
        super(Comment, instance)
    }
}