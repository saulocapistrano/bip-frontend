import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api-config';

@Injectable({ providedIn: 'root' })
export class ClientWalletApiService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/client/wallet`;

  constructor(private readonly http: HttpClient) {}

  deposit(payload: { clientId: string; amount: number }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/deposit`, payload);
  }
}
