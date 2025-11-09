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
    id?: number;
    status: string;
    source: string;
    destination?: string;
    dateUpdate?: string;
}

export interface Order {
    id: number;
    trackingCode: string;
    source: string;
    destination: string;
    distance: string;
    price: number | string;
    customerEmail: string;
    customerName: string;
    weightInKg: number;
    dateCreate: string;
    statusUpdates: StatusUpdate[];
}

export interface CreatePackage {
    source: string;
    destination: string;
    customerEmail: string;
    customerName: string;
    weightInKg: number;
}

@Injectable({ providedIn: 'root' })
export class AdmService {
    private readonly basePath = '/admins';

    constructor(private apiService: ApiService) {}

    /**
     * Registra um novo administrador através do endpoint público de cadastro.
     */
    register(dto: CreateAdm): Observable<Adm> {
        return this.apiService.post<Adm>(`${this.basePath}/register`, dto);
    }

    /**
     * Recupera os dados do administrador autenticado (perfil da sessão atual).
     */
    getAcc(): Observable<Adm> {
        return this.apiService.get<Adm>(`${this.basePath}/account`);
    }

    /**
     * Obtém a lista completa de administradores cadastrados.
     */
    getAllAdmins(): Observable<Adm[]> {
        return this.apiService.get<Adm[]>(`${this.basePath}/users`);
    }

    /**
     * Atualiza parcialmente os dados do administrador autenticado.
     */
    updateAcc(dto: UpdateAdm): Observable<Adm> {
        return this.apiService.patch<Adm>(`${this.basePath}/account`, dto);
    }

    /**
     * Atualiza parcialmente os dados de outro administrador a partir do ID.
     */
    updateAdminById(adminId: number, dto: UpdateAdm): Observable<Adm> {
        return this.apiService.patch<Adm>(`${this.basePath}/users/${adminId}`, dto);
    }

    /**
     * Remove definitivamente a conta do administrador autenticado.
     */
    deleteAcc(): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/account`);
    }

    /**
     * Exclui um administrador específico pelo ID.
     */
    deleteAdminById(adminId: number): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/users/${adminId}`);
    }

    /**
     * Retorna todos os pedidos disponíveis para administração.
     */
    getAllOrders(): Observable<Order[]> {
        return this.apiService.get<Order[]>(`${this.basePath}/orders`);
    }

    /**
     * Busca um pedido específico pelo ID.
     */
    getOrderById(orderId: number): Observable<Order> {
        return this.apiService.get<Order>(`${this.basePath}/orders/${orderId}`);
    }

    /**
     * Registra um novo pedido/pacote no sistema.
     */
    createPackage(dto: CreatePackage): Observable<Order> {
        return this.apiService.post<Order>(`${this.basePath}/orders`, dto);
    }

    /**
     * Adiciona uma atualização de status ao pedido informado.
     */
    updateOrderStatus(orderId: number, dto: Pick<StatusUpdate, 'status' | 'source' | 'destination'>): Observable<StatusUpdate> {
        return this.apiService.patch<StatusUpdate>(`${this.basePath}/orders/${orderId}/status`, dto);
    }
    
    /**
     * Remove um pedido e todo o histórico associado.
     */
    deleteOrder(orderId: number): Observable<void> {
        return this.apiService.delete<void>(`${this.basePath}/orders/${orderId}`);
    }

}