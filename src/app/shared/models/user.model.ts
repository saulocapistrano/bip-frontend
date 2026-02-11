export type UserRole = 'BIP_ADMIN' | 'BIP_CLIENTE' | 'BIP_ENTREGADOR';
export type UserStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  clientBalance: number | null;
  driverBalance: number | null;
  driverScore: number | null;
  createdAt: string;
}
