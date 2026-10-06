import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);

  return from(storageService.get('jwt_token')).pipe(
    switchMap(token => {
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      return next(req);
    })
  );
};