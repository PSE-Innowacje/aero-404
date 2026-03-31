import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(UserDataService).token();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
