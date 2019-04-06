import { MongoID } from "../database/mongoID"

export interface IComment {
    children?: IComment[]
    content: string
    parentId: MongoID
    userId: MongoID
}