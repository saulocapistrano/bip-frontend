import { Component } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { DeliveryListItem, DeliveryResponse, DeliveryStatus } from '../../../../shared/models/delivery-list-item.model';
import { DeliveryMapper } from '../../../../shared/mappers/delivery.mapper';
import { ClientDeliveriesService } from '../../data/client-deliveries.service';
import { ClientWalletService } from '../../data/client-wallet.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-client-home',
  standalone: false,
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss']
})
export class ClientHomeComponent {
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly pageSize = 8;

  public readonly loading$: Observable<boolean>;
  public readonly deliveries$: Observable<DeliveryListItem[]>;
  public readonly pagedDeliveries$: Observable<DeliveryListItem[]>;
  public readonly totalPages$: Observable<number>;

  public page = 1;

  selectedCancelDelivery: DeliveryListItem | null = null;
  cancelReason = '';
  cancelSubmitting = false;
  cancelError: string | null = null;

  depositAmount = 0;
  depositSubmitting = false;
  depositError: string | null = null;
  depositSuccess: string | null = null;

  public readonly statusBadgeClass: Record<DeliveryStatus, string> = {
    AVAILABLE: 'bg-primary',
    IN_ROUTE: 'bg-warning text-dark',
    COMPLETED: 'bg-success',
    CANCELED: 'bg-danger',
    RETURNED_TO_POOL: 'bg-secondary',
  };

  constructor(
    private readonly clientDeliveries: ClientDeliveriesService,
    private readonly clientWallet: ClientWalletService,
  ) {
    const deliveriesResponse$ = this.refreshSubject.pipe(
      startWith(undefined),
      switchMap(() => this.clientDeliveries.listMyDeliveries()),
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError(() => of([] as DeliveryResponse[]))
    );

    this.loading$ = deliveriesResponse$.pipe(
      map(() => false),
      startWith(true),
      catchError(() => of(false))
    );

    this.deliveries$ = deliveriesResponse$.pipe(
      map((items) => items.map((d) => DeliveryMapper.toListItem(d))),
      catchError(() => of([]))
    );

    this.totalPages$ = this.deliveries$.pipe(
      map((items) => Math.max(1, Math.ceil(items.length / this.pageSize)))
    );

    this.pagedDeliveries$ = combineLatest([this.deliveries$, this.pageSubject]).pipe(
      tap(([_, page]) => (this.page = page)),
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

  openCancel(delivery: DeliveryListItem): void {
    this.selectedCancelDelivery = delivery;
    this.cancelReason = '';
    this.cancelError = null;
  }

  closeCancel(): void {
    this.selectedCancelDelivery = null;
    this.cancelReason = '';
    this.cancelError = null;
  }

  confirmCancel(): void {
    if (!this.selectedCancelDelivery) {
      return;
    }

    const reason = this.cancelReason.trim();
    if (!reason) {
      this.cancelError = 'Informe o motivo do cancelamento.';
      return;
    }

    this.cancelSubmitting = true;
    this.cancelError = null;

    this.clientDeliveries.cancelDelivery(this.selectedCancelDelivery.id, reason).subscribe({
      next: () => {
        this.cancelSubmitting = false;
        this.closeCancel();
        this.refresh();
      },
      error: () => {
        this.cancelSubmitting = false;
        this.cancelError = 'Não foi possível cancelar a entrega.';
      },
    });
  }

  canCancel(status: DeliveryStatus): boolean {
    return status !== 'COMPLETED' && status !== 'CANCELED';
  }

  refresh(): void {
    this.pageSubject.next(1);
    this.refreshSubject.next(undefined);
  }

  deposit(): void {
    this.depositError = null;
    this.depositSuccess = null;

    const amount = Number(this.depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      this.depositError = 'Informe um valor maior que zero.';
      return;
    }

    this.depositSubmitting = true;
    this.clientWallet.deposit(amount).subscribe({
      next: () => {
        this.depositSubmitting = false;
        this.depositSuccess = 'Saldo adicionado com sucesso.';
        this.depositAmount = 0;
      },
      error: (err: unknown) => {
        this.depositSubmitting = false;
        const httpError = err as HttpErrorResponse;
        const apiMessage = (httpError?.error as { error?: string } | null)?.error;
        this.depositError = apiMessage && apiMessage.trim()
          ? apiMessage
          : 'Não foi possível adicionar saldo.';
      },
    });
  }
}
