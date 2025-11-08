import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Order, StatusUpdate } from '../../models/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [CardModule, ButtonModule, CommonModule],
  template: `
  <div>
  <p-card 
      [header]="pacote.trackingCode"
      [style]="{ width: '360px', 'margin-bottom': '1rem' }"
      class="pacote-card"
    >
      <ng-template pTemplate="header">
       
      </ng-template>
      
      <p class="descricao">{{ pacote.source }}</p>
      <p class="preco">{{ pacote.destination | currency:'BRL' }}</p>
      <p class="preco">{{ pacote.price | currency:'BRL' }}</p>

      <ng-template pTemplate="footer">
        <p-button 
          label="Ver Detalhes" 
          icon="pi pi-eye"
          (onClick)="onVerDetalhes()"
        >Ver detalhes</p-button>
      </ng-template>
    </p-card>
</div>
  `,
  styleUrl: './cards.component.scss'
})

export class CardsComponent {
  @Input() pacote!: Order;

  constructor(private router: Router) {}
  
  onVerDetalhes() {
    this.router.navigate(['/rastreio', this.pacote.trackingCode]);
  }
}
