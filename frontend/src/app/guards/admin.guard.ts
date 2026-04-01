import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '../services/user-data.service';

export const adminGuard: CanActivateFn = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.role() === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/operations']);
};
