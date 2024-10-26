import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor() {}

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    if (error.status === 0) {
      // a client-siede or network error occured
      console.error('An error occured ', error.error);
    } else {
      // backend returned unsuccessfull response code
      console.error(
        `Backend returned status code ${error.status}, body was: ${error}`
      );
    }
    return throwError(() => new Error(`Error occured. ${error.error.message}`));
  }
}
