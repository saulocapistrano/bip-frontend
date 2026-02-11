import {
  DeliveryListItem,
  DeliveryResponse,
  DeliveryStatus,
} from '../models/delivery-list-item.model';

export class DeliveryMapper {
  static toListItem(api: DeliveryResponse): DeliveryListItem {
    return {
      id: api.id,
      description: api.description,
      pickupAddress: api.pickupAddress,
      deliveryAddress: api.deliveryAddress,
      offeredPrice: api.offeredPrice,
      status: api.status,
      statusLabel: this.statusToLabel(api.status),
      createdAt: api.createdAt,
    };
  }

  private static statusToLabel(status: DeliveryStatus): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponível';
      case 'IN_ROUTE':
        return 'Em rota';
      case 'COMPLETED':
        return 'Concluída';
      case 'CANCELED':
        return 'Cancelada';
      default:
        return status;
    }
  }
}
