import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DeliveriesApiService } from '../../../shared/api/deliveries-api.service';
import {
  DeliveryListItem,
  DeliveryResponse,
  DeliveryStatus,
} from '../../../shared/models/delivery-list-item.model';
import { DeliveryMapper } from '../../../shared/mappers/delivery.mapper';

@Injectable({ providedIn: 'root' })
export class DriverDeliveriesService {
  constructor(private readonly deliveriesApi: DeliveriesApiService) {}

  listAvailable(): Observable<DeliveryResponse[]> {
    return this.deliveriesApi.listAvailableForDriver();
  }

  listAvailableAsListItems(): Observable<DeliveryListItem[]> {
    return this.listAvailable().pipe(
      map((items) => items.map((d) => DeliveryMapper.toListItem(d))),
    );
  }

  listMine(): Observable<DeliveryResponse[]> {
    return this.deliveriesApi.listDriverDeliveriesMine();
  }

  listMineAsListItems(): Observable<DeliveryListItem[]> {
    return this.listMine().pipe(
      map((items) => items.map((d) => DeliveryMapper.toListItem(d))),
    );
  }

  listInRouteMine(): Observable<DeliveryResponse[]> {
    return this.deliveriesApi.listDriverInRouteMine();
  }

  listInRouteMineAsListItems(): Observable<DeliveryListItem[]> {
    return this.listInRouteMine().pipe(
      map((items) => items.map((d) => DeliveryMapper.toListItem(d))),
    );
  }

  listHistoryMineAsListItems(): Observable<DeliveryListItem[]> {
    return this.listMineAsListItems().pipe(
      map((items) => items.filter((d) => this.isHistoryStatus(d.status))),
    );
  }

  acceptDelivery(deliveryId: string): Observable<DeliveryResponse> {
    return this.deliveriesApi.acceptDeliveryMine(deliveryId);
  }

  completeDelivery(deliveryId: string): Observable<DeliveryResponse> {
    return this.deliveriesApi.completeDeliveryMine(deliveryId);
  }

  private isHistoryStatus(status: DeliveryStatus): boolean {
    return status === 'COMPLETED' || status === 'CANCELED' || status === 'RETURNED_TO_POOL';
  }
}
