import { Controller, Get, Query, ID } from "@peregrine/webserver"
import axios from "axios"
import { ContactPerson, Http } from "../models"

@Controller("/contactpersons")
export class ContactPersonController {
    protected apiUrl: string = "https://b2handpicked.azurewebsites.net/GmailAPI/api/v1/contactpersons"

    constructor(protected http: Http = axios){}

    @Get("/")
    public async getAll(@Query("email") email?: string): Promise<ContactPerson[]> {
        const response = await this.http.get<{ contactpersons: ContactPerson[] }>(this.apiUrl + (email ? `?email=${email}` : ""))
        return response.data.contactpersons
    }

    @Get("/{id}")
    public async getById(@ID() id: string): Promise<ContactPerson> {
        const response = await this.http.get<ContactPerson>(`${this.apiUrl}/${id}`)
        return response.data
    }
}