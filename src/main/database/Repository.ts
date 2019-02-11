import { Entity } from "./Entity";

export interface Repository<T, ID = string> {
    getById(id: ID): Promise<Entity<T> | null>
    getAll(): Promise<Entity<T>[]>
    create(model: T): Promise<Entity<T>>
    update(id: ID, model: T): Promise<Entity<T> | null> 
    delete(id: ID): Promise<Entity<T> | null> 
}