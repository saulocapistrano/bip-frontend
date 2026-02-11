import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { ClientRoutingModule } from './client-routing.module';
import { ClientHomeComponent } from './pages/client-home/client-home.component';


@NgModule({
  declarations: [
    ClientHomeComponent
  ],
  imports: [
    SharedModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
