import { Controller, Get, ID, Query } from "@peregrine/webserver"
import Axios from "axios"
import moment from "moment"

import { IDeal, IHttp } from "../models"

@Controller("/deals")
export class DealController {
    protected apiUrl = "https://b2handpicked.azurewebsites.net/GmailAPI/api/v1/deals"

    public constructor(protected http: IHttp = Axios) {}

    @Get("/")
    public async getAll(
        @Query("type") type?: "open" | "closed",
        @Query("customerId") customerId?: string,
    ): Promise<IDeal[]> {
        const response = await this.http.get<{ deals: IDeal[] }>(this.apiUrl)
        let deals = response.data.deals
        deals.forEach(deal => deal.isOpen = !this.isDealClosed(deal))
        if (type) {
            deals = deals.filter(deal => deal.isOpen === (type === "open"))
        }
        if (customerId) {
            deals = deals.filter(deal => deal.customerId === parseInt(customerId))
        }

        return deals
    }

    @Get("/{id}")
    public async getById(@ID() id: string): Promise<IDeal> {
        const response = await this.http.get<IDeal>(`${this.apiUrl}/${id}`)
        const model = response.data
        model.isOpen = !this.isDealClosed(model)

        return response.data
    }

    protected isDealClosed(deal: IDeal): boolean {
        const deadline = moment(new Date(deal.deadline))
        const currentDate = moment()

        return deal.percentage >= 100 && deadline.isBefore(currentDate)
    }
}