export interface IHttp {
    get<T = any>(url: string): Promise<{ data: T; status: number }>
}