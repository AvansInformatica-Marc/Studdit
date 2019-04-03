import { MongoID } from "../database/mongoID"

export interface IComment {
    content: string
    id?: MongoID
    parentId: MongoID
    userId: MongoID
}