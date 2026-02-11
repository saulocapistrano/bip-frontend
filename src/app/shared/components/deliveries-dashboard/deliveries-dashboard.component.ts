import { Component, Input } from '@angular/core';
import {
  DeliveryListItem,
  DeliveryStatus,
} from '../../models/delivery-list-item.model';

@Component({
  selector: 'app-deliveries-dashboard',
  standalone: false,
  templateUrl: './deliveries-dashboard.component.html',
  styleUrls: ['./deliveries-dashboard.component.scss'],
})
export class DeliveriesDashboardComponent {
  @Input() title = '';

  @Input() summaryCards: {
    label: string;
    value: string;
    hint?: string;
    colorClass: string;
  }[] = [];

  @Input() deliveries: DeliveryListItem[] = [];
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() loading = false;

  @Input() statusBadgeClass: Record<DeliveryStatus, string> = {
    AVAILABLE: 'bg-info text-dark',
    IN_ROUTE: 'bg-warning text-dark',
    COMPLETED: 'bg-success',
    CANCELED: 'bg-danger',
  };

  @Input() onPageChange: (page: number) => void = () => {};

  hasPrevious(): boolean {
    return this.currentPage > 1;
  }

  hasNext(): boolean {
    return this.currentPage < this.totalPages;
  }
}
