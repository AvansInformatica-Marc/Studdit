import { http } from "@peregrine/exceptions"
import { Auth, Body, CreateItem, DeleteItem, ID, JsonObject, Resource, UpdateItem } from "@peregrine/webserver"

import { IGraphDB } from "../database/graphDB"
import { IRepository } from "../database/repository"
import { User } from "../models/user"

@Resource("users")
export class UserController {
    public constructor(
        protected readonly userRepository: IRepository<User>,
        protected readonly friendshipDB: IGraphDB<any>,
    ) {}

    @CreateItem()
    public async createUser(@Body() body: unknown): Promise<User> {
        let user
        try {
            user = new User(body)

            user = await this.userRepository.create(user)
        } catch (error) {
            throw new http.BadRequest400Error(error instanceof Error ? error.message : undefined)
        }

        await this.friendshipDB.run("CREATE (a:User {name: $username}) RETURN a", { username: user._id })

        return user
    }

    @UpdateItem()
    public async updatePassword(@ID() id: string, @Body() body: unknown, @Auth() user: null | User): Promise<User> {
        if (user === null || user._id !== id) {
            throw new http.Unauthorised401Error()
        }

        if (typeof body !== "object" || body === null || typeof (body as JsonObject).password !== "string") {
            throw new http.BadRequest400Error("Invalid body")
        }

        const userObject = await this.userRepository.getById(id)
        if (userObject === null) {
            throw new http.NotFound404Error("Error 422 invalid ID")
        }
        userObject.password = (body as JsonObject).password as string
        await this.userRepository.update(id, userObject)

        return userObject
    }

    @DeleteItem()
    public async deleteUser(@ID() id: string, @Auth() user: null | User): Promise<void> {
        if (user === null || user._id !== id) {
            throw new http.Unauthorised401Error()
        }

        const userObject = await this.userRepository.getById(id)
        if (userObject === null) {
            throw new http.NotFound404Error("Error 422 invalid ID")
        }
        userObject.isActive = false
        await this.userRepository.update(id, userObject)
    }
}