import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CreateClient, UpdateClient, Client, StatusUpdate, Order } from '../models/client';

@Injectable({ providedIn: 'root' })
export class ClientService {

    constructor(private apiService: ApiService) {}

    register(dto: CreateClient): Observable<Client> {
        return this.apiService.post<Client>('/clients/register', dto);
    }

    getAcc(): Observable<Client> {
        return this.apiService.get<Client>('/clients/account');
    }

    updateAcc(dto: UpdateClient): Observable<Client> {
        return this.apiService.patch<Client>('/clients/account', dto);
    }

    deleteAcc(): Observable<void> {
        return this.apiService.delete<void>('/clients/account');
    }

    getOrders(): Observable<Order[]> {
         return this.apiService.get<Order[]>('/clients/orders');
    }

    getOrderById(orderId: number): Observable<Order> {
        return this.apiService.get<Order>(`/clients/orders/${orderId}`);
    }
    
}