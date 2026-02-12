import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ClientRoutingModule } from './client-routing.module';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientNewDeliveryComponent } from './pages/client-new-delivery/client-new-delivery.component';


@NgModule({
  declarations: [
    ClientHomeComponent,
    ClientNewDeliveryComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
