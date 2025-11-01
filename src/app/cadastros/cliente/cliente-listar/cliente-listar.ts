import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClienteService } from '../cliente-service';
import { TableModule } from 'primeng/table';
import { Cliente } from '../models/cliente.model';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


/**
 * Arquivo responsavel por armezar toda a regra de negocio do meu componente
 */
@Component({
  selector: 'app-cliente-listar',
  imports: [TableModule,
    ButtonModule,
    TooltipModule,
    CardModule,
    RouterLink,
    Toast
  ],
  standalone: true,
  providers: [],
  templateUrl: './cliente-listar.html',
  styleUrl: './cliente-listar.scss'
})
export class ClienteListar implements OnInit {

  clientes: any[] = [];

  constructor(
    private readonly clienteService: ClienteService,
  private readonly detectorMudancas: ChangeDetectorRef,
private readonly messageService: MessageService) {}


  ngOnInit(): void {
   this.listarClientes();
  }

  listarClientes(): void {
    this.clienteService.listarClientes().subscribe({
    next: (listaClientes: any[]) => {
      this.clientes = listaClientes;
      console.log(this.clientes);
      this.detectorMudancas.detectChanges();
    },
    error: error => {
      console.log("Erro ao buscar clientes");
      console.log(error);
    }
   });
  }

  deletarCliente(id: string) {
    this.clienteService.deleteCliente(id).subscribe({
      next: (_) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente deletado com sucesso!' });
        this.listarClientes();
      },
      error: (erro) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao deletar cliente!' });
      }
    })
  }
}
