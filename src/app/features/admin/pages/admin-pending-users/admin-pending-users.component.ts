import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUsersService } from '../../data/admin-users.service';
import { UserResponse } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-pending-users',
  standalone: false,
  templateUrl: './admin-pending-users.component.html',
  styleUrls: ['./admin-pending-users.component.scss'],
})
export class AdminPendingUsersComponent implements OnInit {
  users$!: Observable<UserResponse[]>;

  constructor(private readonly adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.users$ = this.adminUsers.listPendingUsers();
  }

  approve(user: UserResponse): void {
    const confirmed = confirm(`Aprovar o usuário ${user.name}?`);

    if (!confirmed) {
      return;
    }

    this.adminUsers.approveUser(user.id).subscribe({
      next: () => {
        this.users$ = this.adminUsers.listPendingUsers();
      },
      error: () => {
        alert('Não foi possível aprovar o usuário. Tente novamente.');
      },
    });
  }

  reject(user: UserResponse): void {
    const confirmed = confirm(`Rejeitar o usuário ${user.name}?`);

    if (!confirmed) {
      return;
    }

    this.adminUsers.rejectUser(user.id).subscribe({
      next: () => {
        this.users$ = this.adminUsers.listPendingUsers();
      },
      error: () => {
        alert('Não foi possível rejeitar o usuário. Tente novamente.');
      },
    });
  }
}
