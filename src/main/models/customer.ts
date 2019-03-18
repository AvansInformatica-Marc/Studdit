export interface ICustomer {
    contactPersonIds: number[]
    dealIds: number[]
    email: string
    id: number
    invoiceIds: number[]
    labelId: number
    name: string
    phoneNumber: string
    slack?: string
}