import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  if (!isLoggedIn) {
    inject(Router).navigate(['login']);
    return false;
  }
  return true;
};
