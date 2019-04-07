import { http } from "@peregrine/exceptions"
import * as chai from "chai"
import "mocha"

import { IRepository } from "../../build/main/database/repository"
import { User } from "../../build/main/models/user"
import { UserController } from "../main/controllers/userController"

chai.should()

const returnError = async <T>(f: Promise<T>) => {
    try {
        return await f
    } catch (error) {
        return error
    }
}

describe("UserController", () => {
    it("createUser throws a bad request error when an invalid body was passed", async () => {
        // Arrange
        const fakeRepo = { create: (user: User) => user } as unknown as IRepository<User>
        const controller = new UserController(fakeRepo)
        const expectedErrorType = http.BadRequest400Error

        // Act
        const error1 = await returnError(controller.createUser(null))
        const error2 = await returnError(controller.createUser(undefined))
        const error3 = await returnError(controller.createUser(0))
        const error4 = await returnError(controller.createUser("abcd"))

        // Assert
        error1.should.be.an.instanceOf(expectedErrorType)
        error2.should.be.an.instanceOf(expectedErrorType)
        error3.should.be.an.instanceOf(expectedErrorType)
        error4.should.be.an.instanceOf(expectedErrorType)
    })

    it("createUser returns user when successfully created", async () => {
        // Arrange
        const user = {
            username: "testUsername",
            password: "testPassword",
        }
        const fakeRepo = { create: (user: User) => user } as unknown as IRepository<User>
        const controller = new UserController(fakeRepo)

        // Act
        const result = await controller.createUser(user)

        // Assert
        result.should.be.an.instanceOf(User)
        result.should.have.property("_id").which.is.a("string").that.equals(user.username)
        result.should.have.property("password").which.is.a("string").that.equals(user.password)
        result.should.have.property("isActive").which.is.a("boolean").that.equals(true)
    })

    it("updatePassword throws an unauthorised error when not authenticated", async () => {
        // Arrange
        const user = new User({
            username: "username",
            password: "password",
        })
        const fakeRepo = {
            update: (id: string, u: User) => u,
            getById: (id: string) => user,
        } as unknown as IRepository<User>
        const controller = new UserController(fakeRepo)
        const expectedErrorType = http.Unauthorised401Error

        // Act
        const error = await returnError(controller.updatePassword(user.username, {password: "abcd"}, null))

        // Assert
        error.should.be.an.instanceOf(expectedErrorType)
    })

    it("updatePassword throws a bad request error when an invalid body was passed", async () => {
        // Arrange
        const user = new User({
            username: "username",
            password: "password",
        })
        const fakeRepo = {
            update: (id: string, u: User) => u,
            getById: (id: string) => user,
        } as unknown as IRepository<User>
        const controller = new UserController(fakeRepo)
        const expectedErrorType = http.BadRequest400Error

        // Act
        const error1 = await returnError(controller.updatePassword(user.username, null, user))
        const error2 = await returnError(controller.updatePassword(user.username, undefined, user))
        const error3 = await returnError(controller.updatePassword(user.username, 0, user))
        const error4 = await returnError(controller.updatePassword(user.username, "abcd", user))

        // Assert
        error1.should.be.an.instanceOf(expectedErrorType)
        error2.should.be.an.instanceOf(expectedErrorType)
        error3.should.be.an.instanceOf(expectedErrorType)
        error4.should.be.an.instanceOf(expectedErrorType)
    })
})