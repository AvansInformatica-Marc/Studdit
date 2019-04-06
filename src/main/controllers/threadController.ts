import { GetAll, GetItem, ID, JsonObject, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"
import { Thread } from "../models/thread"

import { HttpAsyncReponse } from "./httpResponse"

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
    public async getAll(): HttpAsyncReponse<Thread[]> {
        return this.threadRepository.getAll()
    }

    @GetItem()
    public async getItem(@ID() id: string): HttpAsyncReponse<Thread> {
        let thread
        try {
            thread = await this.threadRepository.getById(id)
        } catch (error) {
            return { code: 422 }
        }
        (thread as JsonObject).children = ThreadController.getNestedComments(id, await this.commentRepository.getAll())

        return thread
    }
}