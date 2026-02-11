import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientHomeComponent } from './pages/client-home/client-home.component';
import { ClientNewDeliveryComponent } from './pages/client-new-delivery/client-new-delivery.component';

const routes: Routes = [
  { path: '', component: ClientHomeComponent },
  { path: 'new-delivery', component: ClientNewDeliveryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
