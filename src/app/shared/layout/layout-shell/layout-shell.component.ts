import { Component } from '@angular/core';
import { UserContextService } from '../../../core/auth/user-context.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-layout-shell',
  standalone: false,
  templateUrl: './layout-shell.component.html',
  styleUrls: ['./layout-shell.component.scss'],
})
export class LayoutShellComponent {
  sidebarOpen = false;
  sidebarCollapsed = false;

  constructor(
    private readonly userContext: UserContextService,
    private readonly keycloak: KeycloakService,
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarCollapsed(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  get isAdmin(): boolean {
    return this.userContext.hasRole('bip-admin');
  }

  get isClient(): boolean {
    return this.userContext.hasRole('bip-cliente');
  }

  get isDriver(): boolean {
    return this.userContext.hasRole('bip-entregador');
  }

  get userName(): string {
    const token = this.keycloak.getKeycloakInstance().tokenParsed as
      | { name?: string; preferred_username?: string }
      | undefined;

    return token?.name ?? token?.preferred_username ?? '';
  }

  logout(): void {
    void this.keycloak.logout(window.location.origin);
  }
}
