import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { User } from '../../../../core/auth/models/auth-models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../../../../core/services/notifications.service';
import { TopMenuComponent } from '../../../../shared/components/top-menu/top-menu.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, TopMenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  user: User | null = null;

  destroyRef = inject(DestroyRef);

  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private notoficationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUserData();
    console.log(this.user);
    if (this.user) {
      this.menuItems = this.generateTopMenuLinks(this.user.userId);
    }
  }

  private generateTopMenuLinks(userId: number): MenuItem[] {
    return [
      {
        label: 'Pets',
        items: [
          {
            label: 'Rysia',
            routerLink: `/${userId}/pets/rysia`,
          },
          {
            label: 'Bercia',
            routerLink: `/${userId}/pets/bercia`,
          },
        ],
      },
      {
        label: 'Notifications',
        routerLink: `/${userId}/notifications`,
      },
      {
        label: 'Expenses Tracker',
        routerLink: `/${userId}/expenses`,
      },
      {
        label: 'User account',
        routerLink: `/${userId}/user-information`,
      },
    ];
  }

  deleteAccount(): void {
    this.authService
      .deleteUserAccount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          console.log('subscribe - next callback ', response);
          this.notoficationsService.showSuccess(
            'Account was successfully deleted'
          );
          this.router.navigate(['/']);
        },
        error: error => {
          console.log(error);
          this.notoficationsService.showError(
            'Account was not deleted, please try again'
          );
        },
      });
  }

  onLogout(): void {
    this.authService.processLogoutLogic();
  }
}
