import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay, tap } from 'rxjs';
import { AdminUsersService } from '../../data/admin-users.service';
import { UserResponse } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-clients',
  standalone: false,
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss'],
})
export class AdminClientsComponent implements OnInit {
  private readonly pageSubject = new BehaviorSubject<number>(1);
  private readonly pageSize = 8;

  page = 1;
  users$!: Observable<UserResponse[]>;
  pagedUsers$!: Observable<UserResponse[]>;
  totalPages$!: Observable<number>;

  selectedUser: UserResponse | null = null;

  constructor(private readonly adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    const users$ = this.adminUsers.listClients().pipe(shareReplay({ bufferSize: 1, refCount: true }));

    this.users$ = users$;
    this.totalPages$ = users$.pipe(map((users) => Math.max(1, Math.ceil(users.length / this.pageSize))));

    this.pagedUsers$ = combineLatest([users$, this.pageSubject]).pipe(
      tap(([_, page]) => {
        this.page = page;
      }),
      map(([users, page]) => {
        const startIndex = (page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return users.slice(startIndex, endIndex);
      })
    );
  }

  goToPage(page: number, totalPages: number): void {
    const next = Math.min(Math.max(1, page), totalPages);
    this.pageSubject.next(next);
  }

  openDetails(user: UserResponse): void {
    this.selectedUser = user;
  }

  closeDetails(): void {
    this.selectedUser = null;
  }
}
