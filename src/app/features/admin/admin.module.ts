import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminPendingUsersComponent } from './pages/admin-pending-users/admin-pending-users.component';
import { AdminClientsComponent } from './pages/admin-clients/admin-clients.component';
import { AdminDriversComponent } from './pages/admin-drivers/admin-drivers.component';
import { AdminDeliveriesComponent } from './pages/admin-deliveries/admin-deliveries.component';
import { AdminFinancialComponent } from './pages/admin-financial/admin-financial.component';


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminPendingUsersComponent,
    AdminClientsComponent,
    AdminDriversComponent,
    AdminDeliveriesComponent,
    AdminFinancialComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
