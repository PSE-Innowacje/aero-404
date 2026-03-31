import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

export const authGuard: CanActivateFn = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.isLoggedIn() && userDataService.token()) {
    return true;
  }

  userDataService.clearUser();
  return router.createUrlTree(['/login']);
};
