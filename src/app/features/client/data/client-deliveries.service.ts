import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveriesApiService } from '../../../shared/api/deliveries-api.service';
import {
  DeliveryListItem,
  DeliveryResponse,
} from '../../../shared/models/delivery-list-item.model';
import { DeliveryMapper } from '../../../shared/mappers/delivery.mapper';

@Injectable({ providedIn: 'root' })
export class ClientDeliveriesService {
  constructor(
    private readonly deliveriesApi: DeliveriesApiService,
  ) {}

  listMyDeliveries(): Observable<DeliveryResponse[]> {
    return this.deliveriesApi.listClientDeliveriesMine();
  }

  listMyDeliveriesAsListItems(): Observable<DeliveryListItem[]> {
    return this.listMyDeliveries().pipe(
      map((items) => items.map((delivery) => DeliveryMapper.toListItem(delivery))),
    );
  }

  createDelivery(input: {
    pickupAddress: string;
    deliveryAddress: string;
    description: string;
    weightKg: number;
    offeredPrice: number;
  }): Observable<DeliveryResponse> {
    return this.deliveriesApi.createClientDeliveryMine(input);
  }

  cancelDelivery(deliveryId: string, reason: string): Observable<DeliveryResponse> {
    return this.deliveriesApi.cancelDeliveryMine(deliveryId, reason);
  }
}
