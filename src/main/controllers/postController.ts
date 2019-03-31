import { GetAll, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { IPost } from "../models/post"

@Resource("posts")
export class PostController {
    public constructor(public postRepo: IRepository<IPost>) {}

    @GetAll()
    public async getAll(): Promise<IPost[]> {
        return this.postRepo.getAll()
    }
}