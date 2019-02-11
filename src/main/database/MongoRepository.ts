import mongoose from 'mongoose'
import { MongoDB } from "./MongoDB";
import { Repository } from "./Repository"
import { Entity } from './Entity';
import { MongoID } from './MongoID';

type json = {[key: string]: any}

export class MongoRepository<T> implements Repository<T, MongoID> {
    protected mongoRepo: mongoose.Model<T & mongoose.Document, {}>

    constructor(public collectionName: string, schema: json){
        this.mongoRepo = mongoose.model(collectionName, MongoDB.schemaOf(schema), collectionName) as mongoose.Model<T & mongoose.Document, {}>
    }

    public async getById(id: MongoID): Promise<Entity<T> | null> {
        return await this.mongoRepo.findById(id)
    }

    public async getAll(): Promise<Entity<T>[]> {
        return await this.mongoRepo.find()
    }

    public async create(model: T): Promise<Entity<T>> {
        return await this.mongoRepo.create(model)
    }

    public async update(id: MongoID, model: T): Promise<Entity<T> | null> {
        return await this.mongoRepo.findByIdAndUpdate(id, model)
    }

    public async delete(id: MongoID): Promise<Entity<T> | null> {
        return await this.mongoRepo.findByIdAndDelete(id)
    }
}