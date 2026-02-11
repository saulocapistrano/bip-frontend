import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { DeliveriesApiService } from '../../../../shared/api/deliveries-api.service';
import { UsersApiService } from '../../../../shared/api/users-api.service';
import { DeliveryResponse, DeliveryStatus } from '../../../../shared/models/delivery-list-item.model';
import { UserResponse } from '../../../../shared/models/user.model';

type AdminDeliveryRow = DeliveryResponse & {
  clientName: string;
  driverName: string | null;
};

@Component({
  selector: 'app-admin-deliveries',
  standalone: false,
  templateUrl: './admin-deliveries.component.html',
  styleUrls: ['./admin-deliveries.component.scss'],
})
export class AdminDeliveriesComponent implements OnInit {
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly pageSize = 8;

  page = 1;

  deliveries$!: Observable<AdminDeliveryRow[]>;
  pagedDeliveries$!: Observable<AdminDeliveryRow[]>;
  totalPages$!: Observable<number>;

  selectedDelivery: AdminDeliveryRow | null = null;

  constructor(
    private readonly deliveriesApi: DeliveriesApiService,
    private readonly usersApi: UsersApiService
  ) {}

  ngOnInit(): void {
    const usersById$ = this.usersApi.listUsers({}).pipe(
      map((users: UserResponse[]) => new Map(users.map((u) => [u.id, u.name]))),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    const deliveries$ = this.deliveriesApi
      .listAdminDeliveries()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));

    this.deliveries$ = combineLatest([deliveries$, usersById$]).pipe(
      map(([deliveries, usersById]) =>
        deliveries.map((d) => {
          const clientName = usersById.get(d.clientId) ?? d.clientId;
          const driverName = d.driverId ? usersById.get(d.driverId) ?? d.driverId : null;

          return {
            ...d,
            clientName,
            driverName,
          };
        })
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    );

    this.totalPages$ = this.deliveries$.pipe(
      map((items) => Math.max(1, Math.ceil(items.length / this.pageSize)))
    );

    this.pagedDeliveries$ = combineLatest([this.deliveries$, this.pageSubject]).pipe(
      tap(([_, page]) => {
        this.page = page;
      }),
      map(([items, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return items.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  goToPage(page: number, totalPages: number): void {
    const next = Math.min(Math.max(1, page), totalPages);
    this.pageSubject.next(next);
  }

  openDetails(delivery: AdminDeliveryRow): void {
    this.selectedDelivery = delivery;
  }

  closeDetails(): void {
    this.selectedDelivery = null;
  }

  statusLabel(status: DeliveryStatus): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponível';
      case 'IN_ROUTE':
        return 'Em rota';
      case 'CANCELED':
        return 'Cancelada';
      case 'RETURNED_TO_POOL':
        return 'Devolvida ao pool';
      case 'COMPLETED':
        return 'Concluída';
      default:
        return status;
    }
  }

  statusBadgeClass(status: DeliveryStatus): string {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-primary';
      case 'IN_ROUTE':
        return 'bg-warning text-dark';
      case 'CANCELED':
        return 'bg-danger';
      case 'RETURNED_TO_POOL':
        return 'bg-returned-pool';
      case 'COMPLETED':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }
}
