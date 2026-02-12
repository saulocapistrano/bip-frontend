import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleRedirectComponent } from './core/auth/role-redirect/role-redirect.component';
import { roleRedirectGuard } from './core/auth/role-redirect/role-redirect.guard';

const routes: Routes = [
  { path: '', component: RoleRedirectComponent, canActivate: [roleRedirectGuard], pathMatch: 'full' },
  {
    path: 'client',
    loadChildren: () =>
      import('./features/client/client.module').then(m => m.ClientModule),
  },
  {
    path: 'driver',
    loadChildren: () =>
      import('./features/driver/driver.module').then(m => m.DriverModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then(m => m.AdminModule),
  },
  { path: '**', component: RoleRedirectComponent, canActivate: [roleRedirectGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
