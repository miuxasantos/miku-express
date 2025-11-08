import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface CreateAdm {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    cnpj: string;
    organizationName: string;
}

export interface UpdateAdm {
    name?: string;
    email?: string;
    phoneNumber?: string;
    cnpj?: string;
    organizationName?: string;
}

export interface Adm {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    cnpj: string;
    organizationName: string;
}

export interface StatusUpdate {
    status?: string;
    source?: string;
    destination?: string;
}

export interface CreatedPackage {
    id: number;
    trackingCode: string;
    source: string;
    destination: string;
    distance: number;
    price: number;
    customerEmail: string;
    customerName: string;
    weightInKg: number;
    dateCreate: string;
    statusUpdates: StatusUpdate[];
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

@Injectable({ providedIn: 'root' })
export class AdmService {
    constructor(private apiService: ApiService) {}

    register(dto: CreateAdm): Observable<Adm> {
        return this.apiService.post<Adm>('/register', dto);
    }

    getAcc(): Observable<Adm> {
        return this.apiService.get<Adm>('/account');
    }

    updateAcc(dto: UpdateAdm): Observable<Adm> {
        return this.apiService.patch<Adm>('/account', dto);
    }

    deleteAcc(): Observable<void> {
        return this.apiService.delete<void>('/account');
    }

    getAllOrders(): Observable<Order[]> {
        return this.apiService.get<Order[]>('/orders');
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.apiService.get<Order>(`/orders/${orderId}`);
    }

    createPackage(dto: CreatedPackage): Observable<CreatedPackage> {
        return this.apiService.post<CreatedPackage>('/orders', dto);
    }

    updateOrderStatus(orderId: number, dto: StatusUpdate): Observable<Order> {
        return this.apiService.patch<Order>(`/orders/${orderId}/status`, dto);
    }
    
    deleteOrder(orderId: number): Observable<void> {
        return this.apiService.delete<void>(`/orders/${orderId}`);
    }

}