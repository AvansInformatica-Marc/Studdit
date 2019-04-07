import { http } from "@peregrine/exceptions"
import { Auth, CreateItem, DeleteItem, GetAll, ID, Query, Resource } from "@peregrine/webserver"

import { IGraphDB } from "../database/graphDB"
import { Record } from "../database/neo4j/neo4jDB"
import { User } from "../models/user"

@Resource("friendships")
export class FriendshipController {
    public constructor(protected readonly friendshipDB: IGraphDB<Record[]>) {}

    @GetAll()
    public async getFriends(@Auth() user: null | User): Promise<string[]> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        const result = await this.friendshipDB.run(
            "MATCH(a:User)-[r:FRIEND]-(b:User) WHERE a.name = $username RETURN b.name",
            { username: user._id },
        )

        return result.map(record => (record as any)._fields[0])
    }

    @CreateItem()
    public async addFriend(@Query("friendId") friendId: string, @Auth() user: null | User): Promise<void> {
        if (user === null) {
            throw new http.Unauthorised401Error()
        }

        await this.friendshipDB.run(
            "MATCH (a:User {name: $user1}) MATCH (b:User {name: $user2}) MERGE (a)-[r:FRIEND]->(b) RETURN a, b, r",
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