import { JsonObject } from "@peregrine/webserver"

export interface IGraphDB<T> {
    run(query: string, params: JsonObject): Promise<T>
}