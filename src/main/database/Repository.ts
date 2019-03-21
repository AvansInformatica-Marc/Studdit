import { Entity } from "./entity"

export interface IRepository<T, ID = string> {
    create(model: T): Promise<Entity<T>>
    delete(id: ID): Promise<Entity<T> | null>
    getAll(): Promise<Array<Entity<T>>>
    getById(id: ID): Promise<Entity<T> | null>
    update(id: ID, model: T): Promise<Entity<T> | null>
    /* update(entity: Entity<T>): Promise<Entity<T> | null> */
}