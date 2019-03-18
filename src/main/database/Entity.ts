import { MongoID } from "./mongoID"

export type Entity<T> = T & { _id: MongoID }