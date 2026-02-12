import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api-config';
import { DeliveryResponse, DeliveryStatus } from '../models/delivery-list-item.model';

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

  listClientDeliveriesMine(): Observable<DeliveryResponse[]> {
    return this.http.get<DeliveryResponse[]>(`${this.baseUrl}client/deliveries/mine`);
  }

  listDriverDeliveries(driverId: string): Observable<DeliveryResponse[]> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/mine`,
      { params },
    );
  }

  listDriverDeliveriesMine(): Observable<DeliveryResponse[]> {
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/mine/auth`,
    );
  }

  listDriverInRoute(driverId: string): Observable<DeliveryResponse[]> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/in-route`,
      { params },
    );
  }

  listDriverInRouteMine(): Observable<DeliveryResponse[]> {
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/in-route/mine`,
    );
  }

  listAvailableForDriver(): Observable<DeliveryResponse[]> {
    return this.http.get<DeliveryResponse[]>(
      `${this.baseUrl}driver/deliveries/available`,
    );
  }

  listAdminDeliveries(status?: DeliveryStatus): Observable<DeliveryResponse[]> {
    let params = new HttpParams();

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<DeliveryResponse[]>(`${this.baseUrl}admin/deliveries`, {
      params,
    });
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

  createClientDeliveryMine(payload: {
    pickupAddress: string;
    deliveryAddress: string;
    description: string;
    weightKg: number;
    offeredPrice: number;
  }): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(`${this.baseUrl}client/deliveries/mine`, payload);
  }

  acceptDelivery(deliveryId: string, driverId: string): Observable<DeliveryResponse> {
    const params = new HttpParams().set('driverId', driverId);
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}driver/deliveries/${deliveryId}/accept`,
      {},
      { params },
    );
  }

  acceptDeliveryMine(deliveryId: string): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}driver/deliveries/${deliveryId}/accept/mine`,
      {},
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

  completeDeliveryMine(deliveryId: string): Observable<DeliveryResponse> {
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}driver/deliveries/${deliveryId}/complete/mine`,
      {},
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

  cancelDeliveryMine(deliveryId: string, reason: string): Observable<DeliveryResponse> {
    const params = new HttpParams().set('reason', reason);
    return this.http.post<DeliveryResponse>(
      `${this.baseUrl}client/deliveries/${deliveryId}/cancel/mine`,
      {},
      { params },
    );
  }
}
