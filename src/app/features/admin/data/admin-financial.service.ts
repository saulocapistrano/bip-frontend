import { Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { FinancialApiService } from '../../../shared/api/financial-api.service';
import { FinancialSummary, FinancialTransaction, FinancialTransactionType } from '../../../shared/models/financial.model';
import { AdminUsersService } from './admin-users.service';
import { UserResponse } from '../../../shared/models/user.model';

export interface FinancialTransactionListItem extends FinancialTransaction {
  originUserName: string | null;
  destinationUserName: string | null;
}

export interface CancellationPenaltyTopItem {
  userName: string;
  totalAmount: number;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class AdminFinancialService {
  constructor(
    private readonly financialApi: FinancialApiService,
    private readonly adminUsers: AdminUsersService
  ) {}

  listTransactions(filter: {
    start?: Date;
    end?: Date;
    type?: FinancialTransactionType;
    userQuery?: string;
  }): Observable<FinancialTransactionListItem[]> {
    const transactions$ = this.financialApi.listTransactions({ start: filter.start, end: filter.end, type: filter.type });

    const usersById$ = combineLatest([this.adminUsers.listClients(), this.adminUsers.listDrivers()]).pipe(
      map(([clients, drivers]) => {
        const users: UserResponse[] = [...clients, ...drivers];
        return new Map(users.map((u) => [u.id, u.name]));
      })
    );

    return combineLatest([transactions$, usersById$]).pipe(
      map(([transactions, usersById]) => {
        const enriched = transactions
          .slice()
          .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
          .map((t) => ({
            ...t,
            originUserName: t.originUserId ? usersById.get(t.originUserId) ?? t.originUserId : null,
            destinationUserName: t.destinationUserId ? usersById.get(t.destinationUserId) ?? t.destinationUserId : null,
          }));

        if (!filter.userQuery) {
          return enriched;
        }

        const q = filter.userQuery.trim().toLowerCase();
        if (!q) {
          return enriched;
        }

        return enriched.filter((t) => {
          const hay = `${t.originUserName ?? ''} ${t.destinationUserName ?? ''} ${t.description}`.toLowerCase();
          return hay.includes(q);
        });
      })
    );
  }

  getSummary(filter: { start?: Date; end?: Date }): Observable<FinancialSummary> {
    const baseSummary$ = this.financialApi.getSummary(filter);
    const users$ = combineLatest([this.adminUsers.listClients(), this.adminUsers.listDrivers()]).pipe(
      map(([clients, drivers]) => [...clients, ...drivers])
    );

    return combineLatest([baseSummary$, users$]).pipe(
      map(([summary, users]) => {
        const totalWalletBalance = users.reduce((acc, u) => acc + (u.clientBalance ?? 0) + (u.driverBalance ?? 0), 0);

        return {
          ...summary,
          totalWalletBalance,
        };
      })
    );
  }

  topCancellationPenalties(filter: { start?: Date; end?: Date }): Observable<CancellationPenaltyTopItem[]> {
    return this.listTransactions({ start: filter.start, end: filter.end, type: 'CANCELLATION_PENALTY' }).pipe(
      map((items) => {
        const byUser = new Map<string, { userName: string; totalAmount: number; count: number }>();

        for (const t of items) {
          const key = t.originUserId ?? '—';
          const userName = t.originUserName ?? key;
          const current = byUser.get(key);

          if (!current) {
            byUser.set(key, { userName, totalAmount: t.amount, count: 1 });
            continue;
          }

          current.totalAmount += t.amount;
          current.count += 1;
        }

        return Array.from(byUser.values())
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 5);
      })
    );
  }
}
