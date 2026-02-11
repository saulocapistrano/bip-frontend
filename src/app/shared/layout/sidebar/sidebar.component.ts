import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() open = false;
  @Input() collapsed = false;

  @Input() isAdmin = false;
  @Input() isClient = false;
  @Input() isDriver = false;

  @Output() navigate = new EventEmitter<void>();

  onNavigate(): void {
    this.navigate.emit();
  }
}
