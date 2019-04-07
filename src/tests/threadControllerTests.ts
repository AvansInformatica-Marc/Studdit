import { http } from "@peregrine/exceptions"
import * as chai from "chai"
import "mocha"

import { IRepository } from "../../build/main/database/repository"
import { Comment } from "../../build/main/models/comment"
import { Thread } from "../../build/main/models/thread"
import { User } from "../../build/main/models/user"
import { ThreadController } from "../main/controllers/threadController"

chai.should()

const returnError = async <T>(f: Promise<T>) => {
    try {
        return await f
    } catch (error) {
        return error
    }
}

describe("ThreadController", () => {
    it("createThread throws a bad request error when an invalid body was passed", async () => {
        // Arrange
        const fakeThreadRepo = { create: (thread: Thread) => thread } as unknown as IRepository<Thread>
        const fakeCommentRepo = {} as unknown as IRepository<Comment>
        const user = new User({ username: "abcd", password: "admin" })
        const controller = new ThreadController(fakeThreadRepo, fakeCommentRepo)
        const expectedErrorType = http.BadRequest400Error

        // Act
        const error1 = await returnError(controller.createThread(null, user))
        const error2 = await returnError(controller.createThread(undefined, user))
        const error3 = await returnError(controller.createThread(0, user))
        const error4 = await returnError(controller.createThread("abcd", user))

        // Assert
        error1.should.be.an.instanceOf(expectedErrorType)
        error2.should.be.an.instanceOf(expectedErrorType)
        error3.should.be.an.instanceOf(expectedErrorType)
        error4.should.be.an.instanceOf(expectedErrorType)
    })

    it("createThread returns thread with user id when successfully created", async () => {
        // Arrange
        const thread = {
            title: "abcd",
            content: "content",
        }
        const fakeThreadRepo = { create: (thread: Thread) => thread } as unknown as IRepository<Thread>
        const fakeCommentRepo = {} as unknown as IRepository<Comment>
        const user = new User({ username: "abcd", password: "admin" })
        const controller = new ThreadController(fakeThreadRepo, fakeCommentRepo)

        // Act
        const result = await controller.createThread(thread, user)

        // Assert
        result.should.be.an.instanceOf(Thread)
        result.should.have.property("title").which.is.a("string").that.equals(thread.title)
        result.should.have.property("content").which.is.a("string").that.equals(thread.content)
        result.should.have.property("userId").which.is.a("string").that.equals(user.username)
    })

    it("createThread throws an unauthorised error when not authenticated", async () => {
        // Arrange
        const thread = {
            title: "abcd",
            content: "content",
        }
        const fakeThreadRepo = { create: (thread: Thread) => thread } as unknown as IRepository<Thread>
        const fakeCommentRepo = {} as unknown as IRepository<Comment>
        const controller = new ThreadController(fakeThreadRepo, fakeCommentRepo)
        const expectedErrorType = http.Unauthorised401Error

        // Act
        const error = await returnError(controller.createThread(thread, null))

        // Assert
        error.should.be.an.instanceOf(expectedErrorType)
    })

    it("getAll should call repository.getAll once and return the result", async () => {
        // Arrange
        const threads = [
            new Thread({ title: "title123", content: "abcd" }, "user"),
            new Thread({ title: "XD", content: "content" }, "person"),
        ]
        const fakeThreadRepo = { getAll: () => threads } as unknown as IRepository<Thread>
        const fakeCommentRepo = {} as unknown as IRepository<Comment>
        const controller = new ThreadController(fakeThreadRepo, fakeCommentRepo)

        // Act
        const result = await controller.getAll()

        // Assert
        result.should.equal(threads)
    })
})