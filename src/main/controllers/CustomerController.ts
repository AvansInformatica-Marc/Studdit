import { Controller, Get, Query, ID, Patch, Body, JsonObject } from "@peregrine/webserver"
import axios from "axios"
import { Customer, Http } from "../models"
import { Repository } from "../database/Repository"
import { AdditionalCustomerData } from "../repositories/CustomerRepository";
import { http } from "@peregrine/exceptions";
import { MongoID } from "../database/MongoID";

@Controller("/customers")
export class CustomerController {
    protected apiUrl: string = "https://b2handpicked.azurewebsites.net/GmailAPI/api/v1/customers"

    constructor( 
        protected customerRepo: Repository<AdditionalCustomerData, MongoID>,
        protected http: Http = axios
    ){}

    @Get("/")
    public async getAll(@Query("email") email?: string): Promise<Customer[]> {
        // Fetch models from API
        const response = await this.http.get<{ customers: Customer[] }>(this.apiUrl + (email ? `?email=${email}` : ""))
        const customers = response.data.customers

        // Add Slack channel
        const dbCustomers = await this.customerRepo.getAll()
        customers.forEach(customer => {
            const dbCustomer = dbCustomers.find(it => it.customerId == customer.id)
            if(dbCustomer) customer.slack = dbCustomer.slack
        })

        // Return models
        return customers
    }

    @Get("/{id}")
    public async getById(@ID() id: string): Promise<Customer> {
        // Fetch model from API
        const response = await this.http.get<Customer>(`${this.apiUrl}/${id}`)
        const model = response.data

        // Add Slack channel
        const dbCustomer = (await this.customerRepo.getAll()).find(customer => customer.customerId == parseInt(id))
        if(dbCustomer) model.slack = dbCustomer.slack

        // Return model
        return model
    }

    @Patch("/{id}")
    public async addSlackChannel(@ID() id: string, @Body() body: string | JsonObject){
        if(body && typeof body == "object" && body.slack){
            const model = { customerId: parseInt(id), slack: body.slack }
            const dbCustomer = (await this.customerRepo.getAll()).find(customer => customer.customerId == parseInt(id))
            if(dbCustomer){
                await this.customerRepo.update(dbCustomer._id, model)
            } else {
                await this.customerRepo.create(model)
            }
        } else {
            throw new http.BadRequest400Error()
        }

        return {
            status: 204
        }
    }
}