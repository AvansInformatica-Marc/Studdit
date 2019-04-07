import { http } from "@peregrine/exceptions"
import * as chai from "chai"
import "mocha"

import { FriendshipController } from "../main/controllers/friendshipController"

chai.should()

const returnError = async <T>(f: Promise<T>) => {
    try {
        return await f
    } catch (error) {
        return error
    }
}

describe("FriendshipController", () => {
    it("addFriend throws an unauthorised error when not authenticated", async () => {
        // Arrange
        const controller = new FriendshipController({ run: async () => [] })
        const expectedErrorType = http.Unauthorised401Error

        // Act
        const error = await returnError(controller.addFriend("abcd", null))

        // Assert
        error.should.be.an.instanceOf(expectedErrorType)
    })

    it("removeFriend throws an unauthorised error when not authenticated", async () => {
        // Arrange
        const controller = new FriendshipController({ run: async () => [] })
        const expectedErrorType = http.Unauthorised401Error

        // Act
        const error = await returnError(controller.removeFriend("abcd", null))

        // Assert
        error.should.be.an.instanceOf(expectedErrorType)
    })
})