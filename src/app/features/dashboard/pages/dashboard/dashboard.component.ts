import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { User } from '../../../../core/auth/models/auth-models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationsService } from '../../../../core/services/notifications.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  user: User | null = null;

  destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private authService: AuthService,
    private notoficationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUserData();
    console.log(this.user);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.processLogoutLogic();
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
}
