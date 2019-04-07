import { JsonObject } from "@peregrine/webserver"
import { Document, Model, Types } from "mongoose"

import { IConstructor } from "../../constructorType"
import { IRepository } from "../repository"

import { MongoDB } from "./mongoDB"

export class MongoRepository<T extends object> implements IRepository<T> {
    protected readonly mongoModel: Model<T & Document>
    protected readonly obj: T & { __entityName__: string; __pk__?: string; __schema__: JsonObject }

    public constructor(protected readonly entityType: IConstructor<T>, instance: MongoDB) {
        this.obj = entityType.prototype as T & { __entityName__: string; __pk__?: string; __schema__: JsonObject }
        this.mongoModel = instance.model(this.obj.__entityName__, this.obj.__schema__)
    }

    public async create(model: T): Promise<T> {
        const m = await this.mongoModel.create(model)

        return this.replaceIds(m)
    }

    public async delete(id: string): Promise<T | null> {
        const model = await this.mongoModel.findByIdAndRemove(id)

        return model === null ? null : this.replaceIds(model)
    }

    public async getAll(): Promise<T[]> {
        return (await this.mongoModel.find()).map(model => this.replaceIds(model))
    }

    public async getById(id: string): Promise<T | null> {
        const model = await this.mongoModel.findById(id)

        return model === null ? null : this.replaceIds(model)
    }

    public async hasModelWithId(id: string): Promise<boolean> {
        return (await this.mongoModel.findById(id)) !== null
    }

    public async update(id: string, model: T): Promise<T | null> {
        const m = await this.mongoModel.findByIdAndUpdate(id, model)

        return m === null ? null : this.replaceIds(m)
    }

    protected replaceIds(model: T): T {
        const m = JSON.parse(JSON.stringify(model)) as JsonObject
        for (const field of Object.keys(m)) {
            if (m[field] instanceof Types.ObjectId) {
                const f = m[field] as unknown as Types.ObjectId
                (m[field] as unknown) = (new Types.ObjectId(f).toHexString() as unknown as number).toString(16)
            }
        }

        return new (this.entityType)(m)
    }
}