export type UserRole = 'BIP_ADMIN' | 'BIP_CLIENTE' | 'BIP_ENTREGADOR';
export type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  clientBalance?: number;
  driverBalance?: number;
  driverScore?: number;
}
