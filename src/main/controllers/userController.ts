import { http } from "@peregrine/exceptions"
import { Auth, Body, CreateItem, DeleteItem, ID, Resource } from "@peregrine/webserver"

import { IRepository } from "../database/repository"
import { User } from "../models/user"

@Resource("users")
export class UserController {
    public constructor(protected readonly userRepository: IRepository<User>) {}

    @CreateItem()
    public async createUser(@Body() body: unknown): Promise<User> {
        let user
        try {
            user = new User(body)
        } catch (error) {
            throw new http.BadRequest400Error((error as Error).message)
        }

        return this.userRepository.create(user)
    }

    @DeleteItem()
    public async deleteUser(@ID() id: string, @Auth() user: null | User): Promise<object> {
        if (user === null || user._id !== id) {
            throw new http.Unauthorised401Error()
        }

        const userObject = await this.userRepository.getById(id)
        userObject.isActive = false
        await this.userRepository.update(id, userObject)

        return {}
    }
}