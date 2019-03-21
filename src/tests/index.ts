import * as chai from "chai"
import "mocha"

/* import { ContactPersonController } from "../../build/main/controllers/contactPersonController"
import { IContactPerson, IHttp } from "../main/models" */

chai.should()

describe("ContactPersonController", () => {
    it("getAll should return a list of ContactPersons", async () => {
        /* // Arrange
        const contactPersons = [{ id: 1 }, { id: 2 }] as IContactPerson[]
        const httpResponse = { contactpersons: contactPersons }
        const fakeHttp = class implements IHttp {
            public async get<T>(url: string): Promise<{data: T; status: number}> {
                return new Promise((resolve, reject) => {
                    resolve({ data: httpResponse as unknown as T, status: 200 })
                })
            }
        }
        const controller = new ContactPersonController(new fakeHttp())

        // Act
        const result = await controller.getAll()

        // Assert
        result.should.eql(contactPersons) */
    })
})