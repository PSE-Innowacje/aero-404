import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserDataService } from '../services/user-data.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);
  const token = userDataService.token();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && userDataService.isLoggedIn()) {
        userDataService.clearUser();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};
