import { MongoID } from "../database/mongoID"

import { IComment } from "./comment"

export interface IThread {
    children?: IComment[]
    content: string
    title: string
    userId: MongoID
}