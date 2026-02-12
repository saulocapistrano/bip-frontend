import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api-config';
import { UserResponse, UserRole, UserStatus } from '../models/user.model';
import { UserMeResponse } from '../models/user-me.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/admin/users`;
  private readonly meUrl = `${API_CONFIG.baseUrl}/users/me`;

  constructor(private readonly http: HttpClient) {}

  listUsers(filter: { role?: UserRole; status?: UserStatus }): Observable<UserResponse[]> {
    let params = new HttpParams();

    if (filter.role) {
      params = params.set('role', filter.role);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    return this.http.get<unknown[]>(this.baseUrl, { params }).pipe(map((items) => items.map((item) => this.mapUser(item))));
  }

  listPendingByRole(role: UserRole): Observable<UserResponse[]> {
    const params = new HttpParams().set('role', role);
    return this.http
      .get<unknown[]>(`${this.baseUrl}/pending`, { params })
      .pipe(map((items) => items.map((item) => this.mapUser(item))));
  }

  approveUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/approve`, {});
  }

  rejectUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/reject`, {});
  }

  getMe(): Observable<UserMeResponse> {
    return this.http.get<UserMeResponse>(this.meUrl);
  }

  private mapUser(input: unknown): UserResponse {
    const raw = input as Record<string, unknown>;

    const toNumberOrUndefined = (value: unknown): number | undefined => {
      if (value === null || value === undefined) {
        return undefined;
      }

      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
      }

      if (typeof value === 'string') {
        const normalized = value.replace(',', '.');
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : undefined;
      }

      return undefined;
    };

    const fallback = (value: unknown, ...alternatives: unknown[]): unknown => {
      if (value !== null && value !== undefined) {
        return value;
      }

      return alternatives.find((v) => v !== null && v !== undefined);
    };

    const clientBalance =
      toNumberOrUndefined(
        fallback(raw['clientBalance'], raw['saldoCliente'], raw['clientSaldo'], raw['balance'], raw['saldo'], raw['walletBalance'])
      ) ?? null;

    const driverBalance =
      toNumberOrUndefined(
        fallback(raw['driverBalance'], raw['saldoEntregador'], raw['driverSaldo'], raw['balance'], raw['saldo'], raw['walletBalance'])
      ) ?? null;

    const driverScore = toNumberOrUndefined(fallback(raw['driverScore'], raw['score'], raw['rating'])) ?? null;

    return {
      id: String(raw['id'] ?? ''),
      name: String(raw['name'] ?? raw['nome'] ?? ''),
      email: String(raw['email'] ?? ''),
      phone: String(raw['phone'] ?? raw['telefone'] ?? ''),
      role: raw['role'] as UserRole,
      status: raw['status'] as UserStatus,
      clientBalance,
      driverBalance,
      driverScore,
      createdAt: String(raw['createdAt'] ?? ''),
    };
  }
}
