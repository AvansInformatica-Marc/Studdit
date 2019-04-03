import { MongoID } from "../database/mongoID"

export interface IThread {
    content: string
    id?: MongoID
    title: string
    userId: MongoID
}