import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUsersService } from '../../data/admin-users.service';
import { UserResponse, UserRole } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-pending-users',
  standalone: false,
  templateUrl: './admin-pending-users.component.html',
  styleUrls: ['./admin-pending-users.component.scss'],
})
export class AdminPendingUsersComponent implements OnInit {
  users$!: Observable<UserResponse[]>;
  selectedRole: UserRole = 'BIP_CLIENTE';

  constructor(private readonly adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.reload();
  }

  onRoleChange(role: string): void {
    if (role === 'BIP_CLIENTE' || role === 'BIP_ENTREGADOR' || role === 'BIP_ADMIN') {
      this.selectedRole = role;
    } else {
      this.selectedRole = 'BIP_CLIENTE';
    }

    this.reload();
  }

  private reload(): void {
    this.users$ = this.adminUsers.listPendingUsersByRole(this.selectedRole);
  }

  approve(user: UserResponse): void {
    const confirmed = confirm(`Aprovar o usuário ${user.name}?`);

    if (!confirmed) {
      return;
    }

    this.adminUsers.approveUser(user.id).subscribe({
      next: () => {
        this.reload();
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
        this.reload();
      },
      error: () => {
        alert('Não foi possível rejeitar o usuário. Tente novamente.');
      },
    });
  }
}
