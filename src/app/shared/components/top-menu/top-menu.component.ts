import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, RouterLink],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss',
})
export class TopMenuComponent {
  @Input() isLoggedIn = false;
  @Input() items: MenuItem[] = [];
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  emitLogout() {
    this.logout.emit();
  }
}
