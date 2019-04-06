import { JsonObject } from "@peregrine/webserver"
import mongoose, { Document, Model, SchemaTypes, Types } from "mongoose"

import { IRepository } from "../repository"

import { MongoDB } from "./mongoDB"

export class MongoRepository<T extends object> implements IRepository<T> {
    protected static throwNotFoundIfNull<P>(model: P | null): P {
        if (model === null) {
            throw new Error("Not Found")
        }

        return model
    }

    protected readonly mongoModel: Model<T & Document>
    protected readonly obj: T & { __entityName__: string; __pk__?: string; __schema__: JsonObject }

    public constructor(protected readonly entityType: { prototype: T }, instance: MongoDB) {
        this.obj = entityType.prototype as T & { __entityName__: string; __pk__?: string; __schema__: JsonObject }
        this.mongoModel = instance.model(this.obj.__entityName__, this.obj.__schema__)
    }

    public async create(model: T): Promise<T> {
        return this.replaceIds(await this.mongoModel.create(model))
    }

    public async delete(id: string): Promise<T> {
        return this.replaceIds(MongoRepository.throwNotFoundIfNull(await this.mongoModel.findByIdAndRemove(id)))
    }

    public async getAll(): Promise<T[]> {
        return this.replaceAllIds(await this.mongoModel.find())
    }

    public async getById(id: string): Promise<T> {
        return this.replaceIds(MongoRepository.throwNotFoundIfNull(await this.mongoModel.findById(id)))
    }

    public async hasModelWithId(id: string): Promise<boolean> {
        return (await this.mongoModel.findById(id)) !== null
    }

    public async update(id: string, model: T): Promise<T> {
        return this.replaceIds(MongoRepository.throwNotFoundIfNull(await this.mongoModel.findByIdAndUpdate(id, model)))
    }

    protected replaceAllIds(models: T[]): T[] {
        for (const model of models) {
            this.replaceIds(model)
        }

        return models
    }

    protected replaceIds(model: T): T {
        const m = model as JsonObject
        const schema = this.obj.__schema__
        for (const field in schema) {
            if (schema[field].type === SchemaTypes.ObjectId) {
                m[field] = (m[field] as Types.ObjectId).toHexString()
            }
        }
        if (this.obj.__pk__ !== undefined) {
            m[this.obj.__pk__] = (m[this.obj.__pk__] as Types.ObjectId).toHexString()
        }

        const newModel = Object.create(this.entityType.prototype) as JsonObject
        for (const i of Object.keys(m)) {
            newModel[i] = m[i]
        }

        return newModel as T
        // Old: return Object.setPrototypeOf(m, this.entityType.prototype) as T
    }
}