import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, startWith, switchMap } from 'rxjs';
import { AdminFinancialService, CancellationPenaltyTopItem, FinancialTransactionListItem } from '../../data/admin-financial.service';
import { FinancialSummary, FinancialTransactionType } from '../../../../shared/models/financial.model';

@Component({
  selector: 'app-admin-financial',
  standalone: false,
  templateUrl: './admin-financial.component.html',
  styleUrls: ['./admin-financial.component.scss'],
})
export class AdminFinancialComponent implements OnInit {
  private readonly pageSize = 8;
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly refreshSubject = new BehaviorSubject<void>(undefined);

  periodPreset: 'TODAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'CUSTOM' = 'LAST_7_DAYS';
  startDate = '';
  endDate = '';
  type: FinancialTransactionType | '' = '';
  userQuery = '';

  page = 1;

  summary$!: Observable<FinancialSummary>;
  transactions$!: Observable<FinancialTransactionListItem[]>;
  pagedTransactions$!: Observable<FinancialTransactionListItem[]>;
  totalPages$!: Observable<number>;
  topCancellationPenalties$!: Observable<CancellationPenaltyTopItem[]>;

  constructor(private readonly adminFinancial: AdminFinancialService) {}

  ngOnInit(): void {
    const filter$ = this.refreshSubject.pipe(
      startWith(undefined),
      map(() => this.buildFilter())
    );

    this.summary$ = filter$.pipe(
      map((f) => ({ start: f.start, end: f.end })),
      switchMap((f) => this.adminFinancial.getSummary(f))
    );

    this.transactions$ = filter$.pipe(
      switchMap((f) => this.adminFinancial.listTransactions(f))
    );

    this.topCancellationPenalties$ = filter$.pipe(
      map((f) => ({ start: f.start, end: f.end })),
      switchMap((f) => this.adminFinancial.topCancellationPenalties(f))
    );

    const transactionsShared$ = this.transactions$.pipe(shareReplay({ bufferSize: 1, refCount: true }));

    this.totalPages$ = transactionsShared$.pipe(
      map((items) => Math.max(1, Math.ceil(items.length / this.pageSize)))
    );

    this.pagedTransactions$ = combineLatest([transactionsShared$, this.pageSubject]).pipe(
      map(([items, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        return items.slice(startIndex, startIndex + this.pageSize);
      })
    );
  }

  onPresetChange(): void {
    if (this.periodPreset !== 'CUSTOM') {
      this.startDate = '';
      this.endDate = '';
    }

    this.applyFilters();
  }

  applyFilters(): void {
    this.page = 1;
    this.pageSubject.next(1);
    this.refreshSubject.next(undefined);
  }

  clearFilters(): void {
    this.periodPreset = 'LAST_7_DAYS';
    this.startDate = '';
    this.endDate = '';
    this.type = '';
    this.userQuery = '';
    this.applyFilters();
  }

  goToPage(page: number, totalPages: number): void {
    const next = Math.min(Math.max(1, page), totalPages);
    this.page = next;
    this.pageSubject.next(next);
  }

  transactionTypeLabel(type: FinancialTransactionType): string {
    switch (type) {
      case 'CLIENT_DEPOSIT':
        return 'Depósito';
      case 'DELIVERY_PAYMENT':
        return 'Pagamento de entrega';
      case 'CANCELLATION_PENALTY':
        return 'Multa de cancelamento';
    }
  }

  private buildFilter(): {
    start?: Date;
    end?: Date;
    type?: FinancialTransactionType;
    userQuery?: string;
  } {
    const now = new Date();

    const startOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOfDay = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    const parseDateInput = (value: string, end: boolean): Date | undefined => {
      if (!value) {
        return undefined;
      }

      const parts = value.split('-').map((p) => Number(p));
      if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
        return undefined;
      }

      const [y, m, d] = parts;
      const date = new Date(y, m - 1, d);
      return end ? endOfDay(date) : startOfDay(date);
    };

    let start: Date | undefined;
    let end: Date | undefined;

    if (this.periodPreset === 'TODAY') {
      start = startOfDay(now);
      end = endOfDay(now);
    } else if (this.periodPreset === 'LAST_7_DAYS') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = startOfDay(d);
      end = endOfDay(now);
    } else if (this.periodPreset === 'LAST_30_DAYS') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      start = startOfDay(d);
      end = endOfDay(now);
    } else {
      start = parseDateInput(this.startDate, false);
      end = parseDateInput(this.endDate, true);
    }

    const trimmedQuery = this.userQuery.trim();

    return {
      start,
      end,
      type: this.type ? this.type : undefined,
      userQuery: trimmedQuery ? trimmedQuery : undefined,
    };
  }
}
