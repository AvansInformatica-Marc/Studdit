import { JsonObject } from "@peregrine/webserver"

import { Entity, Field, ID, Required } from "../database/mongoDB/mongoORMfunctions"

const isJson = (thing: unknown): thing is JsonObject =>
    thing !== null && typeof thing === "object" && !Array.isArray(thing)

@Entity("thread")
export class Thread {
    @ID()
    public _id?: string

    @Field(String) @Required()
    public content: string

    @Field(String) @Required()
    public title: string

    @ID() @Required()
    public userId: string

    public constructor(object: unknown, customUserId?: string) {
        if (isJson(object) && object.content && object.title && object.userId) {
            this.content = object.content
            this.title = object.title
            this.userId = customUserId !== undefined ? customUserId : object.userId
        } else {
            throw new Error()
        }
    }

    public toJSON(): JsonObject {
        return {
            _id: this._id,
            content: this.content,
            title: this.title,
            userId: this.userId,
        }
    }
}