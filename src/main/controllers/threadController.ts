import { GetAll, GetItem, ID, Resource } from "@peregrine/webserver"

import { Entity } from "../database/entity"
import { MongoID } from "../database/mongoID"
import { IRepository } from "../database/repository"
import { IComment } from "../models/comment"
import { IThread } from "../models/thread"

import { HttpAsyncReponse } from "./httpResponse"

@Resource("threads")
export class ThreadController {
    protected static getNestedComments(
        parentId: MongoID,
        allComments: Array<Entity<IComment>>,
    ): Array<Entity<IComment>> {
        const comments = allComments.filter(comment => comment.parentId === parentId)
        for (const comment of comments) {
            comment.children = ThreadController.getNestedComments(comment._id, allComments)
        }

        return comments
    }

    public constructor(
        protected threadRepository: IRepository<IThread, MongoID>,
        protected commentRepository: IRepository<IComment, MongoID>,
    ) {}

    @GetAll()
    public async getAll(): HttpAsyncReponse<Array<Entity<IThread>>> {
        return this.threadRepository.getAll()
    }

    @GetItem()
    public async getItem(@ID() id: MongoID): HttpAsyncReponse<Entity<IThread>> {
        const thread = await this.threadRepository.getById(id)
        if (thread === null) {
            return { code: 422 }
        }
        thread.children = ThreadController.getNestedComments(id, await this.commentRepository.getAll())

        return thread
    }
}