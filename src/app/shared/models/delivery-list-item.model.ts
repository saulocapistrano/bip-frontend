export type DeliveryStatus =
  | 'AVAILABLE'
  | 'IN_ROUTE'
  | 'COMPLETED'
  | 'CANCELED'
  | 'RETURNED_TO_POOL';

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
  cancellationReason?: string | null;
  returnReason?: string | null;
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
