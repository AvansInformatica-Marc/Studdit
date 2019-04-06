import { Body, CreateItem, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"

import { HttpAsyncReponse } from "./httpResponse"

@Resource("comments")
export class CommentController {
    public constructor(protected commentRepository: IRepository<Comment>) {}

    @CreateItem()
    public async createComment(@Body() body: unknown): HttpAsyncReponse<null> {
        let comment
        try {
            comment = new Comment(body)
        } catch (error) {
            return {
                code: 400,
                body: {
                    errorName: "Bad Request",
                },
            }
        }

        await this.commentRepository.create(comment)

        return null
    }
}