import { http } from "@peregrine/exceptions"
import { Auth, Body, CreateItem, GetAll, GetItem, ID, JsonObject, Resource, UpdateItem, DeleteItem } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { Comment } from "../models/comment"
import { Thread } from "../models/thread"
import { User } from "../models/user"

@Resource("threads")
export class ThreadController {
    public constructor(
        protected readonly threadRepository: IRepository<Thread>,
        protected readonly commentRepository: IRepository<Comment>,
    ) {}

    @GetAll()
    public async getAll(): Promise<Thread[]> {
        return this.threadRepository.getAll()
    }

    @GetItem()
    public async getItem(@ID() id: string): Promise<Thread> {
        const thread = await this.threadRepository.getById(id)
        if (thread === null) {
            throw new http.NotFound404Error("Error 422 invalid ID")
        }

        const allComments = await this.commentRepository.getAll()

        const getNestedComments = (parentId: string): Comment[] => {
            const comments = allComments.filter(comment => comment.parentId === parentId)
            comments.forEach(comment => {
                if (comment._id !== undefined) {
                    comment.children = getNestedComments(comment._id)
                }
            })

            return comments
        }

        thread.children = getNestedComments(thread._id || id)

        return thread
    }

    @CreateItem()
    public async createThread(@Body() body: unknown, @Auth() user: null | User): Promise<Thread> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        let thread
        try {
            thread = new Thread(body, user._id)
        } catch (error) {
            throw new http.BadRequest400Error((error as Error).message)
        }

        return this.threadRepository.create(thread)
    }

    @UpdateItem()
    public async updateContent(@ID() id: string, @Body() body: unknown, @Auth() user: null | User): Promise<Thread> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        if (typeof body !== "object" || body === null || typeof (body as JsonObject).content !== "string") {
            throw new http.BadRequest400Error("Invalid body")
        }

        const thread = await this.threadRepository.getById(id)
        if (thread === null) {
            throw new http.NotFound404Error("Error 422 invalid ID")
        }
        if (user._id !== thread.userId) {
            throw new http.Unauthorised401Error()
        }
        thread.content = (body as JsonObject).content as string
        await this.threadRepository.update(id, thread)

        return thread
    }

    @DeleteItem()
    public async deleteThread(@ID() id: string, @Auth() user: null | User): Promise<void> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        const thread = await this.threadRepository.getById(id)
        if (thread === null) {
            throw new http.NotFound404Error("Error 422 invalid ID")
        }
        if (user._id !== thread.userId) {
            throw new http.Unauthorised401Error()
        }

        const allComments = await this.commentRepository.getAll()

        const deleteRecursively = (parentId: string) => {
            allComments
                .filter(comment => comment.parentId === parentId)
                .forEach(async comment => {
                    if (comment._id !== undefined) {
                        deleteRecursively(comment._id)
                        await this.commentRepository.delete(comment._id)
                    }
                })
        }

        deleteRecursively(id)

        await this.threadRepository.delete(id)
    }
}