import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DeliveriesDashboardComponent } from './components/deliveries-dashboard/deliveries-dashboard.component';
import { LayoutShellComponent } from './layout/layout-shell/layout-shell.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';

@NgModule({
  declarations: [
    DeliveriesDashboardComponent,
    LayoutShellComponent,
    TopbarComponent,
    SidebarComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    CommonModule,
    RouterModule,
    DeliveriesDashboardComponent,
    LayoutShellComponent,
    TopbarComponent,
    SidebarComponent,
  ],
})
export class SharedModule {}
