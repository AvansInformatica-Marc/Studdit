import mongoose from "mongoose"

import { Entity } from "./entity"
import { MongoDB } from "./mongoDB"
import { MongoID } from "./mongoID"
import { IRepository } from "./repository"

interface IJson {
    [key: string]: any
}

export class MongoRepository<T> implements IRepository<T, MongoID> {
    protected mongoRepo: mongoose.Model<T & mongoose.Document>

    public constructor(public collectionName: string, schema: IJson) {
        this.mongoRepo = mongoose.model(
            collectionName,
            MongoDB.schemaOf(schema),
            collectionName,
        )
    }

    public async create(model: T): Promise<Entity<T>> {
        return this.mongoRepo.create(model)
    }

    public async delete(id: MongoID): Promise<Entity<T> | null> {
        return this.mongoRepo.findByIdAndDelete(id)
    }

    public async getAll(): Promise<Array<Entity<T>>> {
        return this.mongoRepo.find()
    }

    public async getById(id: MongoID): Promise<Entity<T> | null> {
        return this.mongoRepo.findById(id)
    }

    public async update(id: MongoID, model: T): Promise<Entity<T> | null> {
        return this.mongoRepo.findByIdAndUpdate(id, model)
    }
}