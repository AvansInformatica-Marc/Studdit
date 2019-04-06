import { MongoDB } from "../database/mongoDB/mongoDB"
import { MongoRepository } from "../database/mongoDB/mongoRepository"
import { IRepository } from "../database/repository"
import { Thread } from "../models/thread"

export class ThreadRepository extends MongoRepository<Thread> implements IRepository<Thread> {
    public constructor(instance: MongoDB) {
        super(Thread, instance)
    }
}