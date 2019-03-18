import { http as HttpErrors } from "@peregrine/exceptions"
import { Body, Controller, Get, ID, JsonObject, Patch, Query } from "@peregrine/webserver"
import Axios from "axios"

import { MongoID } from "../database/mongoID"
import { IRepository } from "../database/repository"
import { ICustomer, IHttp } from "../models"
import { IAdditionalCustomerData } from "../repositories/customerRepository"

@Controller("/customers")
export class CustomerController {
    protected apiUrl = "https://b2handpicked.azurewebsites.net/GmailAPI/api/v1/customers"

    public constructor(
        protected customerRepo: IRepository<IAdditionalCustomerData, MongoID>,
        protected http: IHttp = Axios,
    ) {}

    @Patch("/{id}")
    public async addSlackChannel(@ID() id: string, @Body() body: string | JsonObject) {
        if (body && typeof body === "object" && body.slack) {
            const model = { customerId: parseInt(id), slack: body.slack }
            const dbCustomer = (await this.customerRepo.getAll()).find(customer => customer.customerId === parseInt(id))
            if (dbCustomer) {
                await this.customerRepo.update(dbCustomer._id, model)
            } else {
                await this.customerRepo.create(model)
            }
        } else {
            throw new HttpErrors.BadRequest400Error()
        }

        return {
            status: 204,
        }
    }

    @Get("/")
    public async getAll(@Query("email") email?: string): Promise<ICustomer[]> {
        // Fetch models from API
        const response = await this.http.get<{ customers: ICustomer[] }>(this.apiUrl + (email ? `?email=${email}` : ""))
        const customers = response.data.customers

        // Add Slack channel
        const dbCustomers = await this.customerRepo.getAll()
        customers.forEach(customer => {
            const dbCustomer = dbCustomers.find(it => it.customerId === customer.id)
            if (dbCustomer) {
                customer.slack = dbCustomer.slack
            }
        })

        // Return models
        return customers
    }

    @Get("/{id}")
    public async getById(@ID() id: string): Promise<ICustomer> {
        // Fetch model from API
        const response = await this.http.get<ICustomer>(`${this.apiUrl}/${id}`)
        const model = response.data

        // Add Slack channel
        const dbCustomer = (await this.customerRepo.getAll()).find(customer => customer.customerId === parseInt(id))
        if (dbCustomer) {
            model.slack = dbCustomer.slack
        }

        // Return model
        return model
    }
}