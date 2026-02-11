import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UsersApiService } from '../../../shared/api/users-api.service';
import { UserResponse, UserRole } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  constructor(private readonly usersApi: UsersApiService) {}

  listPendingUsers(): Observable<UserResponse[]> {
    return this.listPendingUsersByRole('BIP_CLIENTE');
  }

  listPendingUsersByRole(role: UserRole): Observable<UserResponse[]> {
    return this.usersApi.listPendingByRole(role);
  }

  listDrivers(): Observable<UserResponse[]> {
    return this.usersApi.listUsers({ role: 'BIP_ENTREGADOR' }).pipe(map((users) => users.filter((u) => u.role === 'BIP_ENTREGADOR')));
  }

  listClients(): Observable<UserResponse[]> {
    return this.usersApi.listUsers({ role: 'BIP_CLIENTE' }).pipe(map((users) => users.filter((u) => u.role === 'BIP_CLIENTE')));
  }

  approveUser(userId: string): Observable<void> {
    return this.usersApi.approveUser(userId);
  }

  rejectUser(userId: string): Observable<void> {
    return this.usersApi.rejectUser(userId);
  }
}
