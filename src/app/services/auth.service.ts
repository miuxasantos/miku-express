import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    email: string;
    name: string;
    role: string;
    userId: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.apiService.post<LoginResponse>('/auth/login', data).pipe(
            tap((response: LoginResponse) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('token_type', response.tokenType);
                localStorage.setItem('auth_token', response.token); // compatibilidade
                localStorage.setItem('user_email', response.email);
                localStorage.setItem('user_name', response.name);
                localStorage.setItem('user_role', response.role);
                localStorage.setItem('user_id', response.userId.toString());
        }))
    }

    getToken(): string | null {
        return localStorage.getItem('token') ?? localStorage.getItem('auth_token');
    }

    getUser(): { id: number; name: string; email: string; role: string } | null {
        const id = localStorage.getItem('user_id');
        const name = localStorage.getItem('user_name');
        const email = localStorage.getItem('user_email');
        const role = localStorage.getItem('user_role');
        return id && name && email && role
            ? { id: parseInt(id), name, email, role }
            : null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
    }
}
