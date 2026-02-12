import { DestroyRef, Injectable, inject } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UsersApiService } from '../../shared/api/users-api.service';
import { DeliveryResponse } from '../../shared/models/delivery-list-item.model';
import SockJS from 'sockjs-client';

@Injectable({ providedIn: 'root' })
export class DriverRealtimeService {
  private readonly usersApi = inject(UsersApiService);
  private readonly destroyRef = inject(DestroyRef);

  private client: Client | null = null;

  private readonly connectedSubject = new BehaviorSubject<boolean>(false);
  public readonly connected$ = this.connectedSubject.asObservable();

  private readonly wsUrlSubject = new BehaviorSubject<string | null>(null);
  public readonly wsUrl$ = this.wsUrlSubject.asObservable();

  private readonly lastErrorSubject = new BehaviorSubject<string | null>(null);
  public readonly lastError$ = this.lastErrorSubject.asObservable();

  private readonly driverMessagesSubject = new Subject<DeliveryResponse>();
  public readonly driverMessages$ = this.driverMessagesSubject.asObservable();

  private readonly availableMessagesSubject = new Subject<DeliveryResponse>();
  public readonly availableMessages$ = this.availableMessagesSubject.asObservable();

  private readonly deliveryUpdatesSubject = new Subject<DeliveryResponse>();
  public readonly deliveryUpdates$ = this.deliveryUpdatesSubject.asObservable();

  private started = false;

  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;

    this.usersApi
      .getMe()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (me) => this.connect(me.id),
        error: () => {
          this.connectedSubject.next(false);
          this.lastErrorSubject.next('Falha ao obter usuário autenticado (/api/users/me).');
          this.started = false;
        },
      });
  }

  private connect(driverId: string): void {
    const wsUrl = this.resolveWsUrl();
    this.wsUrlSubject.next(wsUrl);
    this.lastErrorSubject.next(null);

    const isDevLocal = window.location.hostname === 'localhost' && window.location.port === '4200';

    const client = new Client({
      webSocketFactory: () =>
        isDevLocal
          ? (new SockJS(wsUrl.replace(/^ws/, 'http')) as unknown as WebSocket)
          : new WebSocket(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      this.connectedSubject.next(true);
      this.lastErrorSubject.next(null);

      client.subscribe(`/topic/drivers/${driverId}/deliveries`, (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as DeliveryResponse;
          this.driverMessagesSubject.next(parsed);
        } catch {
          return;
        }
      });

      client.subscribe('/topic/deliveries/available', (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as DeliveryResponse;
          this.availableMessagesSubject.next(parsed);
        } catch {
          return;
        }
      });

      client.subscribe('/topic/deliveries/updates', (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as DeliveryResponse;
          this.deliveryUpdatesSubject.next(parsed);
        } catch {
          return;
        }
      });
    };

    client.onStompError = () => {
      this.connectedSubject.next(false);
      this.lastErrorSubject.next('Erro STOMP ao conectar/assinar.');
    };
    client.onWebSocketClose = () => {
      this.connectedSubject.next(false);
      this.lastErrorSubject.next('WebSocket fechado.');
    };
    client.onWebSocketError = () => {
      this.connectedSubject.next(false);
      this.lastErrorSubject.next('Erro ao abrir WebSocket.');
    };

    client.activate();
    this.client = client;

    this.destroyRef.onDestroy(() => {
      this.client?.deactivate();
      this.client = null;
      this.connectedSubject.next(false);
      this.wsUrlSubject.next(null);
      this.lastErrorSubject.next(null);
      this.started = false;
    });
  }

  private resolveWsUrl(): string {
    if (window.location.hostname === 'localhost' && window.location.port === '4200') {
       return '/api/ws';
    }

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${window.location.host}/ws`;
  }
}
