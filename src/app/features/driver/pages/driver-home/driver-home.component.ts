import { Component, DestroyRef, inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  DeliveryListItem,
  DeliveryStatus,
} from '../../../../shared/models/delivery-list-item.model';
import { DriverDeliveriesService } from '../../data/driver-deliveries.service';
import { DriverRealtimeService } from '../../../../core/realtime/driver-realtime.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-driver-home',
  standalone: false,
  templateUrl: './driver-home.component.html',
  styleUrls: ['./driver-home.component.scss']
})
export class DriverHomeComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly pageSize = 8;

  public readonly realtimeConnected$: Observable<boolean>;
  public readonly realtimeWsUrl$: Observable<string | null>;
  public readonly realtimeLastError$: Observable<string | null>;

  public readonly loading$: Observable<boolean>;
  public readonly deliveries$: Observable<DeliveryListItem[]>;
  public readonly pagedDeliveries$: Observable<DeliveryListItem[]>;
  public readonly totalPages$: Observable<number>;

  public page = 1;

  acceptingId: string | null = null;
  acceptError: string | null = null;
  availableNotice: string | null = null;

  public readonly statusBadgeClass: Record<DeliveryStatus, string> = {
    AVAILABLE: 'bg-primary',
    IN_ROUTE: 'bg-warning text-dark',
    COMPLETED: 'bg-success',
    CANCELED: 'bg-danger',
    RETURNED_TO_POOL: 'bg-secondary',
  };

  constructor(
    private readonly driverDeliveries: DriverDeliveriesService,
    private readonly driverRealtime: DriverRealtimeService,
  ) {
    this.realtimeConnected$ = this.driverRealtime.connected$;
    this.realtimeWsUrl$ = this.driverRealtime.wsUrl$;
    this.realtimeLastError$ = this.driverRealtime.lastError$;
    this.driverRealtime.start();

    this.driverRealtime.availableMessages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.availableNotice = 'Nova entrega disponível.';
        this.refreshSubject.next(undefined);
      });

    this.driverRealtime.driverMessages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSubject.next(undefined));

    this.driverRealtime.deliveryUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSubject.next(undefined));

    const deliveriesResponse$ = this.refreshSubject.pipe(
      startWith(undefined),
      switchMap(() => this.driverDeliveries.listAvailableAsListItems()),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError(() => of([] as DeliveryListItem[])),
    );

    this.loading$ = deliveriesResponse$.pipe(
      map(() => false),
      startWith(true),
      catchError(() => of(false)),
    );

    this.deliveries$ = deliveriesResponse$;

    this.totalPages$ = this.deliveries$.pipe(
      map((items) => Math.max(1, Math.ceil(items.length / this.pageSize))),
    );

    this.pagedDeliveries$ = combineLatest([this.deliveries$, this.pageSubject]).pipe(
      tap(([_, page]) => (this.page = page)),
      map(([items, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return items.slice(startIndex, startIndex + this.pageSize);
      }),
    );
  }

  goToPage(page: number, totalPages: number): void {
    const next = Math.min(Math.max(1, page), totalPages);
    this.pageSubject.next(next);
  }

  refresh(): void {
    this.availableNotice = null;
    this.pageSubject.next(1);
    this.refreshSubject.next(undefined);
  }

  canAccept(status: DeliveryStatus): boolean {
    return status === 'AVAILABLE';
  }

  accept(delivery: DeliveryListItem): void {
    if (!this.canAccept(delivery.status)) {
      return;
    }

    this.acceptError = null;
    this.acceptingId = delivery.id;

    this.driverDeliveries.acceptDelivery(delivery.id).subscribe({
      next: () => {
        this.acceptingId = null;
        this.refresh();
      },
      error: () => {
        this.acceptingId = null;
        this.acceptError = 'Não foi possível aceitar a entrega.';
      },
    });
  }
}
