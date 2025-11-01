import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private readonly httpClient: HttpClient){}

  getEstados() {
    return this.httpClient.get('http://localhost:8080/api/v1/estados/combo_estados');
  }
}
