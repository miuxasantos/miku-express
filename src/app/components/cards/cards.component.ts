import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Order, StatusUpdate } from '../../models/client';
import { Router, RouterModule } from '@angular/router';

/**
 * Cartão resumido para exibição de pedidos em "Meus Pacotes".
 * Mostra informações principais e direciona para o rastreio detalhado.
 */
@Component({
  selector: 'app-cards',
  imports: [CardModule, ButtonModule, CommonModule, RouterModule],
  template: `
  <div>
  <p-card 
      [header]="pacote.trackingCode"
      [style]="{ width: '360px', 'margin-bottom': '1rem' }"
      class="pacote-card"
    >
      <ng-template pTemplate="header">
       
      </ng-template>
      
      <p class="descricao">
        <strong>Origem:</strong> {{ pacote.source }}
      </p>
      <p class="descricao">
        <strong>Destino:</strong> {{ pacote.destination }}
      </p>
      <p class="preco">{{ formatPrice(pacote.price) }}</p>

      <ng-template pTemplate="footer">
        <p-button 
          label="Ver Detalhes" 
          icon="pi pi-eye"
          (onClick)="onVerDetalhes()"
        ></p-button>
      </ng-template>
    </p-card>
</div>
  `,
  styleUrl: './cards.component.scss'
})

export class CardsComponent {
  @Input() pacote!: Order;

  constructor(private router: Router) {}
  
  /** Formata o preço do pedido lidando com valores string/number. */
  formatPrice(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }

    const numeric = typeof value === 'string' ? Number(value) : value;

    if (Number.isNaN(numeric)) {
      return '—';
    }

    return numeric.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onVerDetalhes() {
    this.router.navigate(['/rastreio'], {
      queryParams: { code: this.pacote.trackingCode }
    });
  }
}
