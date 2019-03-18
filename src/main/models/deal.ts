export interface IDeal {
    customerId: number
    deadline: string
    employeeIds: number[]
    id: number
    isOpen?: boolean
    labelId: number
    percentage: number
    title: string
    value: number
}