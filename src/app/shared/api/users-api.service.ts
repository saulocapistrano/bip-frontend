import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api-config';
import { UserResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/admin/users`;

  constructor(private readonly http: HttpClient) {}

  listUsers(filter: { role?: string; status?: string }): Observable<UserResponse[]> {
    let params = new HttpParams();

    if (filter.role) {
      params = params.set('role', filter.role);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    return this.http.get<UserResponse[]>(this.baseUrl, { params });
  }

  approveUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/approve`, {});
  }

  rejectUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${userId}/reject`, {});
  }
}
