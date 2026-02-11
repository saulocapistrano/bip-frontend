import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserContextService } from '../../../core/auth/user-context.service';
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
    private readonly userContext: UserContextService,
  ) {}

  listMyDeliveries(): Observable<DeliveryResponse[]> {
    const clientId = this.userContext.currentUserId;
    return this.deliveriesApi.listClientDeliveries(clientId);
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
    const clientId = this.userContext.currentUserId;
    return this.deliveriesApi.createClientDelivery({ clientId, ...input });
  }
}
