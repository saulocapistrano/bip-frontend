import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { DriverRoutingModule } from './driver-routing.module';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { DriverHistoryComponent } from './pages/driver-history/driver-history.component';
import { DriverInRouteComponent } from './pages/driver-in-route/driver-in-route.component';


@NgModule({
  declarations: [
    DriverHomeComponent,
    DriverInRouteComponent,
    DriverHistoryComponent
  ],
  imports: [
    SharedModule,
    DriverRoutingModule
  ]
})
export class DriverModule { }
