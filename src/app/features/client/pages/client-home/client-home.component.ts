import { Component } from '@angular/core';
import { DeliveryListItem } from '../../../../shared/models/delivery-list-item.model';

@Component({
  selector: 'app-client-home',
  standalone: false,
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent {

  public readonly summaryCards = [
    { label: 'Entregas hoje', value: '—', colorClass: 'client-summary-card--blue' },
    { label: 'Em rota', value: '—', colorClass: 'client-summary-card--yellow' },
    { label: 'Concluídas', value: '—', colorClass: 'client-summary-card--green' },
  ];

  public readonly deliveries: DeliveryListItem[] = [
    {
      id: '1',
      description: 'Entrega de documentos',
      pickupAddress: 'Av. Paulista, 1000',
      deliveryAddress: 'Rua Augusta, 200',
      offeredPrice: 25,
      status: 'AVAILABLE',
      statusLabel: 'Disponível',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      description: 'Entrega de encomenda',
      pickupAddress: 'Rua A, 10',
      deliveryAddress: 'Rua B, 20',
      offeredPrice: 48.9,
      status: 'IN_ROUTE',
      statusLabel: 'Em rota',
      createdAt: new Date().toISOString(),
    },
  ];

  public currentPage = 1;
  public totalPages = 3;
  public loading = false;

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
