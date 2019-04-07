import { http } from "@peregrine/exceptions"
import * as chai from "chai"
import "mocha"

import { IRepository } from "../../build/main/database/repository"
import { Comment } from "../../build/main/models/comment"
import { Thread } from "../../build/main/models/thread"
import { User } from "../../build/main/models/user"
import { CommentController } from "../main/controllers/commentController"

chai.should()

const returnError = async <T>(f: Promise<T>) => {
    try {
        return await f
    } catch (error) {
        return error
    }
}

describe("CommentController", () => {
    it("createComment returns comment with user id when successfully created", async () => {
        // Arrange
        const comment = {
            content: "content",
            parentId: "abcd",
        }
        const fakeThreadRepo = { hasModelWithId: (id: string) => true } as unknown as IRepository<Thread>
        const fakeCommentRepo = {
            create: (comment: Comment) => comment,
            hasModelWithId: (id: string) => true,
        } as unknown as IRepository<Comment>
        const user = new User({ username: "abcd", password: "admin" })
        const controller = new CommentController(fakeThreadRepo, fakeCommentRepo)

        // Act
        const result = await controller.createComment(comment, user)

        // Assert
        result.should.be.an.instanceOf(Comment)
        result.should.have.property("content").which.is.a("string").that.equals(comment.content)
        result.should.have.property("parentId").which.is.a("string").that.equals(comment.parentId)
        result.should.have.property("userId").which.is.a("string").that.equals(user.username)
    })

    it("createComment throws a bad request error when an invalid body was passed", async () => {
        // Arrange
        const fakeThreadRepo = { hasModelWithId: (id: string) => true } as unknown as IRepository<Thread>
        const fakeCommentRepo = {
            create: (comment: Comment) => comment,
            hasModelWithId: (id: string) => true,
        } as unknown as IRepository<Comment>
        const user = new User({ username: "abcd", password: "admin" })
        const controller = new CommentController(fakeThreadRepo, fakeCommentRepo)
        const expectedErrorType = http.BadRequest400Error

        // Act
        const error1 = await returnError(controller.createComment(null, user))
        const error2 = await returnError(controller.createComment(undefined, user))
        const error3 = await returnError(controller.createComment(0, user))
        const error4 = await returnError(controller.createComment("abcd", user))

        // Assert
        error1.should.be.an.instanceOf(expectedErrorType)
        error2.should.be.an.instanceOf(expectedErrorType)
        error3.should.be.an.instanceOf(expectedErrorType)
        error4.should.be.an.instanceOf(expectedErrorType)
    })

    it("createComment throws an unauthorised error when not authenticated", async () => {
        // Arrange
        const comment = {
            content: "content",
            parentId: "abcd",
        }
        const fakeThreadRepo = { hasModelWithId: (id: string) => true } as unknown as IRepository<Thread>
        const fakeCommentRepo = {
            create: (comment: Comment) => comment,
            hasModelWithId: (id: string) => true,
        } as unknown as IRepository<Comment>
        const controller = new CommentController(fakeThreadRepo, fakeCommentRepo)
        const expectedErrorType = http.Unauthorised401Error

        // Act
        const error = await returnError(controller.createComment(comment, null))

        // Assert
        error.should.be.an.instanceOf(expectedErrorType)
    })
})