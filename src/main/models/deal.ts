export interface Deal {
    id: number
    title: string
    value: number
    deadline: string
    percentage: number
    customerId: number
    employeeIds: number[]
    labelId: number
    isOpen?: boolean
}