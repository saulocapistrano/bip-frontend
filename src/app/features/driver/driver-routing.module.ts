import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { DriverHistoryComponent } from './pages/driver-history/driver-history.component';
import { DriverInRouteComponent } from './pages/driver-in-route/driver-in-route.component';

const routes: Routes = [
  { path: '', component: DriverHomeComponent },
  { path: 'in-route', component: DriverInRouteComponent },
  { path: 'history', component: DriverHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
