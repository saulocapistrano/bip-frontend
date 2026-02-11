export type DeliveryStatus = 'AVAILABLE' | 'IN_ROUTE' | 'COMPLETED' | 'CANCELED';

export interface DeliveryResponse {
  id: string;
  clientId: string;
  driverId?: string | null;
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  weightKg: number;
  offeredPrice: number;
  status: DeliveryStatus;
  createdAt: string;
}

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
