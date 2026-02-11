import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api-config';
import { DeliveryResponse } from '../models/delivery-list-item.model';

@Injectable({ providedIn: 'root' })
export class DeliveriesApiService {
  private readonly baseUrl = `${API_CONFIG.baseUrl}/`;

  constructor(private readonly http: HttpClient) {}

  listClientDeliveries(clientId: string): Observable<DeliveryResponse[]> {
    const params = new HttpParams().set('clientId', clientId);
    return this.http.get<DeliveryResponse[]>(`${this.baseUrl}client/deliveries`, {
      params,
    });
  }

  listDriverDeliveries(driverId: string): Observable<DeliveryResponse[]> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/mine`,
      { params },
    );
  }

  listDriverInRoute(driverId: string): Observable<DeliveryResponse[]> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/in-route`,
      { params },
    );
  }

  listAvailableForDriver(): Observable<DeliveryResponse[]> {
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/available`,
    );
  }

  createClientDelivery(payload: {
    clientId: string;
    pickupAddress: string;
    deliveryAddress: string;
    description: string;
    weightKg: number;
    offeredPrice: number;
  }): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(`${this.baseUrl}client/deliveries`, payload);
  }

  acceptDelivery(deliveryId: string, driverId: string): Observable<DeliveryResponse> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}driver/deliveries/${deliveryId}/accept`,
      {},
      { params },
    );
  }

  completeDelivery(deliveryId: string, driverId: string): Observable<DeliveryResponse> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}driver/deliveries/${deliveryId}/complete`,
      {},
      { params },
    );
  }

  cancelDelivery(
    deliveryId: string,
    clientId: string,
    reason: string,
  ): Observable<DeliveryResponse> {
    const params = new HttpParams().set('clientId', clientId).set('reason', reason);
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}client/deliveries/${deliveryId}/cancel`,
      {},
      { params },
    );
  }
}
