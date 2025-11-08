import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-busca',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './busca.component.html',
  styleUrls: ['./busca.component.scss'],
})
export class BuscaComponent implements OnInit {
  @Output() buscarPacote = new EventEmitter<string>();
  
  trackingCode: string = '';
  loading: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Componente inicializado
  }

  buscar() {
    if (!this.trackingCode) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Digite um código de rastreio'
      });
      return;
    }

    this.loading = true;
    this.buscarPacote.emit(this.trackingCode);
  }
}