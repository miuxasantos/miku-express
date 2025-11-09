export interface CreateClient {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    cpf: string;
    dateOfBirth: string;
    gender: string;
}

export interface UpdateClient {
    name?: string;
    email?: string;
    phoneNumber?: string;
    cpf?: string;
    dateOfBirth?: string;
    gender?: string;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    cpf?: string;
    dateOfBirth?: string;
    gender?: string;
    role?: string;
}

export interface StatusUpdate {
    status?: string;
    source?: string;
    destination?: string;
}

export interface Order {
    id: number;
    trackingCode: string;
    source: string;
    destination: string;
    distance: number;
    price: number | string;
    weightInKg: number;
    dateCreate: string;
    statusUpdates: StatusUpdate[];
}
