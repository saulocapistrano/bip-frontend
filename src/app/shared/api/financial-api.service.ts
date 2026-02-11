import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FinancialSummary, FinancialTransaction, FinancialTransactionType } from '../models/financial.model';

@Injectable({ providedIn: 'root' })
export class FinancialApiService {
  listTransactions(filter: {
    start?: Date;
    end?: Date;
    type?: FinancialTransactionType;
  }): Observable<FinancialTransaction[]> {
    const items = this.mockTransactions();

    const startMs = filter.start?.getTime();
    const endMs = filter.end?.getTime();

    const filtered = items.filter((t) => {
      const occurredMs = new Date(t.occurredAt).getTime();

      if (startMs !== undefined && occurredMs < startMs) {
        return false;
      }

      if (endMs !== undefined && occurredMs > endMs) {
        return false;
      }

      if (filter.type && t.type !== filter.type) {
        return false;
      }

      return true;
    });

    return of(filtered);
  }

  getSummary(filter: {
    start?: Date;
    end?: Date;
  }): Observable<FinancialSummary> {
    const items = this.mockTransactions();

    const startMs = filter.start?.getTime();
    const endMs = filter.end?.getTime();

    const filtered = items.filter((t) => {
      const occurredMs = new Date(t.occurredAt).getTime();

      if (startMs !== undefined && occurredMs < startMs) {
        return false;
      }

      if (endMs !== undefined && occurredMs > endMs) {
        return false;
      }

      return true;
    });

    const sumByType = (type: FinancialTransactionType): number =>
      filtered.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

    return of({
      totalClientDeposits: sumByType('CLIENT_DEPOSIT'),
      totalDriverPayments: sumByType('DELIVERY_PAYMENT'),
      totalCancellationPenalties: sumByType('CANCELLATION_PENALTY'),
      totalWalletBalance: null,
    });
  }

  private mockTransactions(): FinancialTransaction[] {
    const now = Date.now();
    const iso = (msAgo: number): string => new Date(now - msAgo).toISOString();

    return [
      {
        id: 'tx-001',
        occurredAt: iso(1000 * 60 * 30),
        type: 'CLIENT_DEPOSIT',
        originUserId: 'client-001',
        destinationUserId: null,
        deliveryId: null,
        amount: 120.5,
        description: 'Depósito em carteira',
      },
      {
        id: 'tx-002',
        occurredAt: iso(1000 * 60 * 60 * 4),
        type: 'DELIVERY_PAYMENT',
        originUserId: 'client-001',
        destinationUserId: 'driver-001',
        deliveryId: 'delivery-123',
        amount: 35,
        description: 'Pagamento de entrega',
      },
      {
        id: 'tx-003',
        occurredAt: iso(1000 * 60 * 60 * 20),
        type: 'CANCELLATION_PENALTY',
        originUserId: 'client-002',
        destinationUserId: null,
        deliveryId: 'delivery-124',
        amount: 8,
        description: 'Multa por cancelamento',
      },
      {
        id: 'tx-004',
        occurredAt: iso(1000 * 60 * 60 * 28),
        type: 'CLIENT_DEPOSIT',
        originUserId: 'client-002',
        destinationUserId: null,
        deliveryId: null,
        amount: 200,
        description: 'Depósito em carteira',
      },
      {
        id: 'tx-005',
        occurredAt: iso(1000 * 60 * 60 * 48),
        type: 'DELIVERY_PAYMENT',
        originUserId: 'client-002',
        destinationUserId: 'driver-002',
        deliveryId: 'delivery-125',
        amount: 52.9,
        description: 'Pagamento de entrega',
      },
      {
        id: 'tx-006',
        occurredAt: iso(1000 * 60 * 60 * 80),
        type: 'CANCELLATION_PENALTY',
        originUserId: 'client-001',
        destinationUserId: null,
        deliveryId: 'delivery-126',
        amount: 12,
        description: 'Multa por cancelamento',
      },
    ];
  }
}
