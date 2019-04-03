import { GetAll, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { IComment } from "../models/comment"

@Resource("comments")
export class CommentController {
    public constructor(public commentRepository: IRepository<IComment>) {}

    @GetAll()
    public async getAll(): Promise<IComment[]> {
        return this.commentRepository.getAll()
    }
}