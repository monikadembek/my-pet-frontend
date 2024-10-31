import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { User } from '../../../../core/auth/models/auth-models';

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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getUserData();
    console.log(this.user);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.processLogoutLogic();
  }
}
