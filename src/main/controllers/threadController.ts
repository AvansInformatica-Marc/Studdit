import { GetAll, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { IThread } from "../models/thread"

@Resource("threads")
export class ThreadController {
    public constructor(public threadRepository: IRepository<IThread>) {}

    @GetAll()
    public async getAll(): Promise<IThread[]> {
        return this.threadRepository.getAll()
    }
}