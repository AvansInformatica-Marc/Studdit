export interface Customer {
    id: number
    email: string
    name: string
    phoneNumber: string
    contactPersonIds: number[]
    labelId: number
    dealIds: number[]
    invoiceIds: number[]
    slack?: string
}