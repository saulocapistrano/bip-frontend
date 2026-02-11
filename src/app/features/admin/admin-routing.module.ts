import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminClientsComponent } from './pages/admin-clients/admin-clients.component';
import { AdminDeliveriesComponent } from './pages/admin-deliveries/admin-deliveries.component';
import { AdminDriversComponent } from './pages/admin-drivers/admin-drivers.component';
import { AdminFinancialComponent } from './pages/admin-financial/admin-financial.component';
import { AdminPendingUsersComponent } from './pages/admin-pending-users/admin-pending-users.component';

const routes: Routes = [
  { path: '', component: AdminHomeComponent },
  { path: 'users/pending', component: AdminPendingUsersComponent },
  { path: 'users/clients', component: AdminClientsComponent },
  { path: 'users/drivers', component: AdminDriversComponent },
  { path: 'deliveries', component: AdminDeliveriesComponent },
  { path: 'financial', component: AdminFinancialComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
