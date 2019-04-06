import { Body, CreateItem, Json, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { IComment } from "../models/comment"

import { HttpAsyncReponse } from "./httpResponse"

@Resource("comments")
export class CommentController {
    protected static isComment(object: string | Json | null | undefined): object is IComment {
        return (object !== null && typeof object === "object" && !Array.isArray(object) &&
            object.content && object.parentId && object.userId) as boolean
    }

    public constructor(protected commentRepository: IRepository<IComment>) {}

    @CreateItem()
    public async createComment(@Body() comment: string | Json | null | undefined): HttpAsyncReponse<null> {
        if (CommentController.isComment(comment)) {
            await this.commentRepository.create(comment)
        }

        return null
    }
}