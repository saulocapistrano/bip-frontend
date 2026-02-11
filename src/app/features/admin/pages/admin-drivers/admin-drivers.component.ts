import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUsersService } from '../../data/admin-users.service';
import { UserResponse } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-admin-drivers',
  standalone: false,
  templateUrl: './admin-drivers.component.html',
  styleUrls: ['./admin-drivers.component.scss'],
})
export class AdminDriversComponent implements OnInit {
  users$!: Observable<UserResponse[]>;

  constructor(private readonly adminUsers: AdminUsersService) {}

  ngOnInit(): void {
    this.users$ = this.adminUsers.listDrivers();
  }
}
