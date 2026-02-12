import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { UserContextService } from '../user-context.service';

export const roleRedirectGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const userContext = inject(UserContextService);

  const roles = userContext.roles;

  if (roles.includes('bip-admin')) {
    return router.parseUrl('/admin');
  }

  if (roles.includes('bip-entregador')) {
    return router.parseUrl('/driver');
  }

  return router.parseUrl('/client');
};
