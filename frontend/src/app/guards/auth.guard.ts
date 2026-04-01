import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);
  const token = userDataService.token();

  if (userDataService.isLoggedIn() && token && !isTokenExpired(token)) {
    return true;
  }

  userDataService.clearUser();
  return router.createUrlTree(['/login']);
};
