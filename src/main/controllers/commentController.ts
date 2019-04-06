import { Auth, Body, CreateItem, DeleteItem, ID, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"
import { Thread } from "../models/thread"
import { User } from "../models/user"

@Resource("comments")
export class CommentController {
    public constructor(
        protected readonly threadRepository: IRepository<Thread>,
        protected readonly commentRepository: IRepository<Comment>,
    ) {}

    @CreateItem()
    public async createComment(@Body() body: unknown, @Auth() user: null | User): Promise<Comment> {
        if (user === null) {
            throw {
                code: 401,
                body: {
                    errorName: "Unauthorised",
                },
            }
        }

        let comment
        try {
            comment = new Comment(body, user._id)
            if (
                !(await this.threadRepository.hasModelWithId(comment.parentId)) &&
                !(await this.commentRepository.hasModelWithId(comment.parentId))
            ) {
                throw new Error("Parent thread/comment was not found")
            }
        } catch (error) {
            throw {
                code: 400,
                body: {
                    errorName: "Bad Request",
                    errorMessage: (error as Error).message,
                },
            }
        }

        return this.commentRepository.create(comment)
    }

    @DeleteItem()
    public async deleteComment(@ID() id: string, @Auth() user: null | User): Promise<object> {
        const comment = await this.commentRepository.getById(id)

        if (user === null || comment.userId !== user._id) {
            throw {
                code: 401,
                body: {
                    errorName: "Unauthorised",
                },
            }
        }
        comment.content = "[DELETED]"
        await this.commentRepository.update(id, comment)

        return {}
    }
}