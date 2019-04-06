import { Auth, Body, CreateItem, GetAll, GetItem, ID, JsonObject, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"
import { Thread } from "../models/thread"
import { User } from "../models/user"

@Resource("threads")
export class ThreadController {
    protected static getNestedComments(
        parentId: string | undefined,
        allComments: Comment[],
    ): Comment[] {
        const comments = allComments.filter(comment => comment.parentId === parentId)
        for (const comment of comments) {
            (comment as JsonObject).children = ThreadController.getNestedComments(comment._id, allComments)
        }

        return comments
    }

    public constructor(
        protected threadRepository: IRepository<Thread>,
        protected commentRepository: IRepository<Comment>,
    ) {}

    @GetAll()
    public async getAll(): Promise<Thread[]> {
        return this.threadRepository.getAll()
    }

    @GetItem()
    public async getItem(@ID() id: string): Promise<Thread> {
        let thread
        try {
            thread = await this.threadRepository.getById(id)
        } catch (error) {
            throw { code: 422 }
        }
        (thread as JsonObject).children = ThreadController.getNestedComments(id, await this.commentRepository.getAll())

        return thread
    }

    @CreateItem()
    public async createThread(@Body() body: unknown, @Auth() user: null | User): Promise<Thread> {
        if (user === null) {
            throw {
                code: 401,
                body: {
                    errorName: "Unauthorised",
                },
            }
        }

        let thread
        try {
            thread = new Thread(body, user._id)
        } catch (error) {
            throw {
                code: 400,
                body: {
                    errorName: "Bad Request",
                },
            }
        }

        return this.threadRepository.create(thread)
    }
}