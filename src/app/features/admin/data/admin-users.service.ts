import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersApiService } from '../../../shared/api/users-api.service';
import { UserResponse } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private readonly usersApi: UsersApiService) {}

  listPendingUsers(): Observable<UserResponse[]> {
    return this.usersApi.listUsers({ status: 'PENDING' });
  }

  listDrivers(): Observable<UserResponse[]> {
    return this.usersApi.listUsers({ role: 'BIP_ENTREGADOR' });
  }

  listClients(): Observable<UserResponse[]> {
    return this.usersApi.listUsers({ role: 'BIP_CLIENTE' });
  }

  approveUser(userId: string): Observable<void> {
    return this.usersApi.approveUser(userId);
  }

  rejectUser(userId: string): Observable<void> {
    return this.usersApi.rejectUser(userId);
  }
}
