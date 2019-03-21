import mongoose from "mongoose"

import { Entity } from "./entity"
import { MongoDB } from "./mongoDB"
import { MongoDBInstance } from "./mongoDBInstance"
import { MongoID } from "./mongoID"
import { IRepository } from "./repository"

interface IJson {
    [key: string]: any
}

interface IModelCreator {
    model<T extends mongoose.Document>(name: string, schema?: mongoose.Schema, collection?: string): mongoose.Model<T>
}

export class MongoRepository<T> implements IRepository<T, MongoID> {
    protected mongoRepo: mongoose.Model<T & mongoose.Document>

    public constructor(public collectionName: string, schema: IJson, instance?: MongoDBInstance) {
        this.mongoRepo = ((instance ? instance.connection : mongoose) as IModelCreator).model(
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

    /* public async update(entity: Entity<T>): Promise<Entity<T> | null> {
        return this.update(entity._id, entity)
    } */
}