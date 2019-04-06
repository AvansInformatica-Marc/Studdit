export interface IRepository<T, ID = string> {
    create(model: T): Promise<T>
    delete(id: ID): Promise<T>
    getAll(): Promise<T[]>
    getById(id: ID): Promise<T>
    update(id: ID, model: T): Promise<T>
}