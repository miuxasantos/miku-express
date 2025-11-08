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
    nome: string;
    email: string;
    telefone?: string;
    cpf?: string;
    dataNascimento?: string;
    genero?: string;
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
    price: number;
    weightInKg: number;
    dateCreate: string;
    statusUpdates: StatusUpdate[];
}
