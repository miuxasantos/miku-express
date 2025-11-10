import { Component, OnInit } from '@angular/core';
import { CardsComponent } from '../../components/cards/cards.component';
import { ClientService } from '../../services/client.service';
import { Order, StatusUpdate } from '../../models/client';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacotes',
  imports: [CardsComponent, ScrollPanelModule, CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Meus Pacotes</h1>
      
      <div>
        <img class="mikutracking" src="assets/trackingmiku.webp" />
      </div>
      <div class="cards-container-wrapper">
        <p-scrollPanel 
          [style]="{ width: '100%', height: '80vh' }"
          styleClass="custom-scrollpanel"
        >
          <div class="cards-container">
            <app-cards 
              *ngFor="let order of orders"
              [pacote]="order"
            ></app-cards>
          </div>
        </p-scrollPanel>
      </div>
    </div>
  `,
  styleUrl: './pacotes.component.scss'
})

export class PacotesComponent implements OnInit {
  orders: Order[] = [];

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit() {
    this.carregarPacotes();
  }

  carregarPacotes() {

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.clientService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Erro ao carregar pacotes:', error);
      }
    });
  }
}
