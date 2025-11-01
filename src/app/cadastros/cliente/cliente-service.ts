import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from './models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  urlCliente: string = "http://localhost:8080/api/v1/clientes"

  constructor(private readonly httpCliente: HttpClient) {}

  listarClientes() {
     return this.httpCliente.get<any[]>(`${this.urlCliente}/listar`);
  }

  salvarCliente(cliente: Cliente) {
    return this.httpCliente.post<Cliente>(
      `${this.urlCliente}/salvar-cliente`,
      cliente
    )
  }

  buscarClientePorId(id: string) {
    return this.httpCliente.get<Cliente>(`${this.urlCliente}/buscar-cliente/${id}`);
  }

  atualizarCliente(id: string, cliente: Cliente) {
    return this.httpCliente.put<Cliente>(`${this.urlCliente}/atualizar-cliente/${id}`, cliente);
  }

  deleteCliente(id: string) {
    return this.httpCliente.delete(`${this.urlCliente}/deletar-cliente/${id}`);
  }
}
