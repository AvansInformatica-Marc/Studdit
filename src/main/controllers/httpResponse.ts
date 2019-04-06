import { Json } from "@peregrine/webserver"

export type HttpReponse<T> = T | { body?: string | Json; code: number }
export type HttpAsyncReponse<T> = Promise<T | { body?: string | Json; code: number }>