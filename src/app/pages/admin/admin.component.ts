import { Component, OnInit } from '@angular/core';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  orders: any[] = [];

  constructor(private admService: AdmService) {}

  ngOnInit() {
    this.admService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error fetching orders:', err)
    });
  }
}
