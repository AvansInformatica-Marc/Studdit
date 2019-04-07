import { Exception } from "@peregrine/exceptions"
import { JsonObject } from "@peregrine/webserver"

import { Entity, Field, ID, Required } from "../database/mongoDB/mongoORMfunctions"

const isJson = (thing: unknown): thing is JsonObject =>
    thing !== null && typeof thing === "object" && !Array.isArray(thing)

@Entity("comment")
export class Comment {
    @ID()
    public _id?: string

    public children?: Comment[]

    @Field(String) @Required()
    public content: string

    @ID() @Required()
    public parentId: string

    @Field(String) @Required()
    public userId: string

    public constructor(object: unknown, customUserId?: string) {
        if (isJson(object) && object.content && object.parentId && (object.userId || customUserId)) {
            if (object._id !== undefined) {
                this._id = object._id
            }
            this.content = object.content
            this.parentId = object.parentId
            this.userId = customUserId !== undefined ? customUserId : object.userId
        } else {
            throw new Exception("Invalid object")
        }
    }

    public toJSON(): JsonObject {
        return {
            _id: this._id,
            content: this.content,
            parentId: this.parentId,
            userId: this.userId,
            children: this.children !== undefined ? this.children.map(child => child.toJSON()) : [],
        }
    }
}