import { ContactPerson, Http } from "../main/models"
import { ContactPersonController } from "../main/controllers/ContactPersonController"
import "mocha"
import * as chai from "chai"

chai.should()

describe(`ContactPersonController`, () => {
    it(`getAll should return a list of ContactPersons`, async () => {
        // Arrange
        const contactPersons = [{ id: 1 }, { id: 2 }] as ContactPerson[]
        const httpResponse = { contactpersons: contactPersons }
        const fakeHttp = class {
            public get<T>(url: string): Promise<{data: T, status: number}> {
                return new Promise((resolve, reject) => {
                    resolve({ data: httpResponse as unknown as T, status: 200 })
                })
            }
        }
        const controller = new ContactPersonController(new fakeHttp())

        // Act
        const result = await controller.getAll()

        // Assert
        result.should.eql(contactPersons)
    })
})