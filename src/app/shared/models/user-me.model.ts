import { UserRole, UserStatus } from './user.model';

export interface UserMeResponse {
  id: string;
  role: UserRole;
  status: UserStatus;
  keycloakId: string;
}
