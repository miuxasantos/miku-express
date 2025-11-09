import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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

@Injectable({ providedIn: 'root' })
export class PublicService {

    constructor(private apiService: ApiService) {}

    getOrderByTrackingCode(trackingCode: string): Observable<Order> {
        // const sanitizedCode = trackingCode.trim().toUpperCase();
        return this.apiService.get<Order>(`/publics/orders/tracking?code=${encodeURIComponent(trackingCode)}`);
    }
}