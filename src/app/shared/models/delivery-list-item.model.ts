export type DeliveryStatus = 'AVAILABLE' | 'IN_ROUTE' | 'COMPLETED' | 'CANCELED';

export interface DeliveryListItem {
  id: string;
  description: string;
  pickupAddress: string;
  deliveryAddress: string;
  offeredPrice: number;
  status: DeliveryStatus;
  statusLabel: string;
  createdAt: string;
}
