import { MongoRepository } from "../database/MongoRepository";
import { MongoDB } from "../database/MongoDB";

const types = MongoDB.Types

export type AdditionalCustomerData = { customerId: number, slack?: string }

export class CustomerRepository extends MongoRepository<AdditionalCustomerData> {
    constructor(){
        super("customers", {
            customerId: {
                type: types.Number,
                unique: true,
                required: true
            }, slack: {
                type: types.String,
                unique: false,
                required: false
            }
        })
    }
}