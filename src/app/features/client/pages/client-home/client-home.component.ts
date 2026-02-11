import { Component } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, startWith } from 'rxjs';
import { DeliveryListItem } from '../../../../shared/models/delivery-list-item.model';
import { ClientDeliveriesService } from '../../data/client-deliveries.service';

@Component({
  selector: 'app-client-home',
  standalone: false,
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent {
  public readonly deliveries$: Observable<DeliveryListItem[]>;
  public readonly loading$: Observable<boolean>;

  public readonly summaryCards = [
    { label: 'Entregas hoje', value: '—', colorClass: 'client-summary-card--blue' },
    { label: 'Em rota', value: '—', colorClass: 'client-summary-card--yellow' },
    { label: 'Concluídas', value: '—', colorClass: 'client-summary-card--green' },
  ];

  public currentPage = 1;
  public totalPages = 1;

  constructor(private readonly clientDeliveries: ClientDeliveriesService) {
    const raw$ = this.clientDeliveries.listMyDeliveriesAsListItems().pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.loading$ = raw$.pipe(
      map(() => false),
      startWith(true),
      catchError(() => of(false)),
    );

    this.deliveries$ = raw$.pipe(catchError(() => of([])));
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
