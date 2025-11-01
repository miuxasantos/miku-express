import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private readonly httpClient: HttpClient){}

  getCidadesPorEstado(estadoId: number, nomeCidadeDigitado: string) {
    return this.httpClient.get(`http://localhost:8080/api/v1/cidades/combo_cidades/estado/${estadoId}/nome/${nomeCidadeDigitado}`);
  }

}
