import { http } from "@peregrine/exceptions"
import { Auth, Body, CreateItem, DeleteItem, ID, Resource, UpdateItem, JsonObject, Query } from "@peregrine/webserver"

import { User } from "../models/user"

@Resource("friendships")
export class FriendshipController {
    @CreateItem()
    public async addFriend(
        @ID() id: string,
        @Query("friendId") friendId: string,
        @Auth() user: null | User,
    ): Promise<void> {
        if (user === null || user._id !== id) {
            throw new http.Unauthorised401Error()
        }

        // TODO
    }

    @DeleteItem()
    public async removeFriend(
        @ID() id: string,
        @Query("friendId") friendId: string,
        @Auth() user: null | User,
    ): Promise<void> {
        if (user === null || user._id !== id) {
            throw new http.Unauthorised401Error()
        }

        // TODO
    }
}