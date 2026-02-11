import { Directive, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DeliveryListItem } from '../models/delivery-list-item.model';

export interface PaginatedDeliveries {
  items: DeliveryListItem[];
  currentPage: number;
  totalPages: number;
}

@Directive()
export abstract class BaseDeliveriesPage implements OnInit {
  deliveries: DeliveryListItem[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    if (page < 1 || (this.totalPages && page > this.totalPages)) {
      return;
    }

    this.loading = true;

    this.fetchDeliveries(page)
      .pipe(
        tap((result) => {
          this.deliveries = result.items;
          this.currentPage = result.currentPage;
          this.totalPages = result.totalPages;
          this.loading = false;
        }),
      )
      .subscribe({
        error: () => {
          this.loading = false;
        },
      });
  }

  protected abstract fetchDeliveries(page: number): Observable<PaginatedDeliveries>;
}
