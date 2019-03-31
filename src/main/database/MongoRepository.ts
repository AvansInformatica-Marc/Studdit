import mongoose from "mongoose"

import { Entity } from "./entity"
import { MongoDBInstance } from "./mongoDBInstance"
import { MongoID } from "./mongoID"
import { IRepository } from "./repository"

export class MongoRepository<T> implements IRepository<T, MongoID> {
    protected mongoRepo: mongoose.Model<T & mongoose.Document>

    public constructor(
        public collectionName: string,
        schema: mongoose.SchemaDefinition,
        instance: MongoDBInstance = new MongoDBInstance(mongoose.connection, ""),
    ) {
        this.mongoRepo = instance.model(collectionName, schema)
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

    /* public async update(entity: Entity<T>): Promise<Entity<T> | null> {
        return this.update(entity._id, entity)
    } */
}