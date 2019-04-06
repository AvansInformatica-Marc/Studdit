import { JsonObject } from "@peregrine/webserver"

import { Entity, Field, ID, Required, Unique } from "../database/mongoDB/mongoORMfunctions"

const isJson = (thing: unknown): thing is JsonObject =>
    thing !== null && typeof thing === "object" && !Array.isArray(thing)

@Entity("user")
export class User {
    @Field(String) @Required() @Unique()
    public _id?: string

    public get username() {
        return this._id
    }

    @Field(Boolean) @Required()
    public isActive: boolean

    @Field(String) @Required()
    public password: string

    public constructor(object: unknown) {
        if (isJson(object) && object.username && object.password) {
            this._id = object.username
            this.password = object.password
            this.isActive = object.isActive !== undefined ? object.isActive : true
        } else {
            throw new Error("Invalid object")
        }
    }

    public toJSON(): JsonObject {
        return {
            _id: this._id,
            username: this.username,
            password: this.password,
            isActive: this.isActive,
        }
    }
}