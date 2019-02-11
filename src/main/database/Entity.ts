import { MongoID } from "./MongoID";

export type Entity<T> = T & { _id: MongoID }