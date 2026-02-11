import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUsersService } from '../../data/admin-users.service';
import { UserResponse } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-clients',
  standalone: false,
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss'],
})
export class AdminClientsComponent implements OnInit {
  users$!: Observable<UserResponse[]>;

  constructor(private readonly adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.users$ = this.adminUsers.listClients();
  }
}
