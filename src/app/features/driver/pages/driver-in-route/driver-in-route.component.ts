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
  selector: 'app-driver-in-route',
  standalone: false,
  templateUrl: './driver-in-route.component.html',
  styleUrls: ['./driver-in-route.component.scss'],
})
export class DriverInRouteComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly pageSize = 8;

  public readonly loading$: Observable<boolean>;
  public readonly deliveries$: Observable<DeliveryListItem[]>;
  public readonly pagedDeliveries$: Observable<DeliveryListItem[]>;
  public readonly totalPages$: Observable<number>;

  public page = 1;

  completingId: string | null = null;
  completeError: string | null = null;

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
    this.driverRealtime.start();

    this.driverRealtime.driverMessages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSubject.next(undefined));

    this.driverRealtime.deliveryUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshSubject.next(undefined));

    const deliveriesResponse$ = this.refreshSubject.pipe(
      startWith(undefined),
      switchMap(() => this.driverDeliveries.listInRouteMineAsListItems()),
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
    this.pageSubject.next(1);
    this.refreshSubject.next(undefined);
  }

  canComplete(status: DeliveryStatus): boolean {
    return status === 'IN_ROUTE';
  }

  complete(delivery: DeliveryListItem): void {
    if (!this.canComplete(delivery.status)) {
      return;
    }

    this.completeError = null;
    this.completingId = delivery.id;

    this.driverDeliveries.completeDelivery(delivery.id).subscribe({
      next: () => {
        this.completingId = null;
        this.refresh();
      },
      error: () => {
        this.completingId = null;
        this.completeError = 'Não foi possível concluir a entrega.';
      },
    });
  }
}
