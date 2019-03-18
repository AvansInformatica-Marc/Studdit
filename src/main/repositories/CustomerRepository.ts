import { MongoDB } from "../database/mongoDB"
import { MongoRepository } from "../database/mongoRepository"

const types = MongoDB.TYPES

export interface IAdditionalCustomerData {
    customerId: number
    slack?: string
}

export class CustomerRepository extends MongoRepository<IAdditionalCustomerData> {
    public constructor() {
        super("customers", {
            customerId: {
                type: types.Number,
                unique: true,
                required: true,
            },
            slack: {
                type: types.String,
                unique: false,
                required: false,
            },
        })
    }
}