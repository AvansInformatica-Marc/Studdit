import { http } from "@peregrine/exceptions"
import { Auth, CreateItem, DeleteItem, ID, Query, Resource } from "@peregrine/webserver"

import { IGraphDB } from "../database/graphDB"
import { User } from "../models/user"

@Resource("friendships")
export class FriendshipController {
    public constructor(protected readonly friendshipDB: IGraphDB<any>) {}

    @CreateItem()
    public async addFriend(@Query("friendId") friendId: string, @Auth() user: null | User): Promise<void> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        await this.friendshipDB.run(
            "MATCH (a:User {name: $user1}) MATCH (b:User {name: $user2}) MERGE (a)-[:FRIEND]-(b)",
            { user1: user._id, user2: friendId },
        )
    }

    @DeleteItem()
    public async removeFriend(@ID() friendId: string, @Auth() user: null | User): Promise<void> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        await this.friendshipDB.run(
            "MATCH(a:User)-[r:FRIEND]-(b:User) WHERE a.name = $user1 AND b.name = $user2 DELETE r RETURN a, b",
            { user1: user._id, user2: friendId },
        )
    }
}