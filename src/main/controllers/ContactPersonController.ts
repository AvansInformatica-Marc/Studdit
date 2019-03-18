import { Controller, Get, ID, Query } from "@peregrine/webserver"
import Axios from "axios"

import { IContactPerson, IHttp } from "../models"

@Controller("/contactpersons")
export class ContactPersonController {
    protected apiUrl = "https://b2handpicked.azurewebsites.net/GmailAPI/api/v1/contactpersons"

    public constructor(protected http: IHttp = Axios) {}

    @Get("/")
    public async getAll(@Query("email") email?: string): Promise<IContactPerson[]> {
        const response = 
            await this.http.get<{ contactpersons: IContactPerson[] }>(this.apiUrl + (email ? `?email=${email}` : ""))

        return response.data.contactpersons
    }

    @Get("/{id}")
    public async getById(@ID() id: string): Promise<IContactPerson> {
        const response = await this.http.get<IContactPerson>(`${this.apiUrl}/${id}`)

        return response.data
    }
}