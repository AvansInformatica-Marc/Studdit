export interface IConstructor<T> {
    readonly prototype: T
    new(value?: any): T
}