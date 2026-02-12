import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { UsersApiService } from '../../../shared/api/users-api.service';
import { ClientWalletApiService } from '../../../shared/api/client-wallet-api.service';

@Injectable({ providedIn: 'root' })
export class ClientWalletService {
  constructor(
    private readonly usersApi: UsersApiService,
    private readonly walletApi: ClientWalletApiService,
  ) {}

  deposit(amount: number): Observable<void> {
    return this.usersApi.getMe().pipe(
      switchMap((me) => this.walletApi.deposit({ clientId: me.id, amount })),
    );
  }
}
