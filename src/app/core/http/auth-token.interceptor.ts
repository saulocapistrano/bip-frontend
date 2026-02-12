import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { API_CONFIG } from '../config/api-config';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private readonly keycloak: KeycloakService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const baseUrl = API_CONFIG.baseUrl;
    const isRelativeBaseUrl = baseUrl.startsWith('/');
    const isApiRequest =
      req.url.startsWith(baseUrl) ||
      (isRelativeBaseUrl && req.url.startsWith(`${window.location.origin}${baseUrl}`));

    if (!isApiRequest) {
      return next.handle(req);
    }

    return from(this.keycloak.updateToken(10)).pipe(
      switchMap(() => {
        return from(this.keycloak.getToken()).pipe(
          switchMap((token) => {
            if (!token) {
              return next.handle(req);
            }

            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });

            return next.handle(cloned);
          }),
        );
      }),
    );
  }
}
