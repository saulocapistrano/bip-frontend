import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class UserContextService {
  constructor(private readonly keycloak: KeycloakService) {}

  get userId(): string | null {
    const token = this.keycloak.getKeycloakInstance().tokenParsed as { sub?: string } | undefined;
    return token?.sub ?? null;
  }

  get roles(): string[] {
    return this.keycloak.getUserRoles() ?? [];
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
