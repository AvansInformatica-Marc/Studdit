import { Body, CreateItem, DeleteItem, Resource, ID, Auth } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"
import { User } from "../models/user"

@Resource("comments")
export class CommentController {
    public constructor(protected commentRepository: IRepository<Comment>) {}

    @CreateItem()
    public async createComment(@Body() body: unknown, @Auth() user: null | User): Promise<object> {
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
            // TODO: Check if link exists
        } catch (error) {
            throw {
                code: 400,
                body: {
                    errorName: "Bad Request",
                },
            }
        }

        await this.commentRepository.create(comment)

        return {}
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