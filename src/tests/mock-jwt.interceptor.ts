import { HttpInterceptorFn } from '@angular/common/http';

export const mockJwtInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer mock-access-token`,
    },
  });
  return next(clonedRequest);
};
