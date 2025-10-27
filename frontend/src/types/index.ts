export interface User {
    id: string
    name: string
    email: string
}

export interface Application {
    _id: string
    title: string
    type: string
    status: string
    deadline: string
    notes: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface ApplicationFormData {
    title: string
    type: string
    status: string
    deadline: string
    notes: string
}
