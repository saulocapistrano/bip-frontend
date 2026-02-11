import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input() userName = '';

  @Output() menuToggle = new EventEmitter<void>();
  @Output() collapseToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onToggleMenu(): void {
    this.menuToggle.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  onToggleCollapse(): void {
    this.collapseToggle.emit();
  }
}
