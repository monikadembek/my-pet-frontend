import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then(
        c => c.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import(
        './core/auth/pages/forgot-password/forgot-password.component'
      ).then(c => c.ForgotPasswordComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/auth/pages/register/register.component').then(
        c => c.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.component').then(
        c => c.LoginComponent
      ),
  },
  { path: '', component: HomeComponent },
];
