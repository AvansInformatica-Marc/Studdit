export interface Http {
    get<T = any>(url: string): Promise<{ data: T, status: number }>
}