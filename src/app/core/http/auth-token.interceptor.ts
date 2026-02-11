import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { API_CONFIG } from '../config/api-config';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private readonly keycloak: KeycloakService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(API_CONFIG.baseUrl)) {
      return next.handle(req);
    }

    const token = this.keycloak.getKeycloakInstance().token;

    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(cloned);
  }
}
