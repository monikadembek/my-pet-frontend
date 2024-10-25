import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  TokensResponseDto,
  User,
} from '../models/auth-models';
import { ErrorHandlingService } from '../../services/error-handling.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isLoggedIn(): boolean {
    return !!this.getToken('accessToken');
  }

  constructor(
    private authApiService: AuthApiService,
    private errorHandlingService: ErrorHandlingService,
    private router: Router
  ) {}

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeToken(key: string): void {
    localStorage.removeItem(key);
  }

  saveUserData(userId: number, name: string, email: string): void {
    localStorage.setItem(
      'user',
      JSON.stringify({
        userId,
        name,
        email,
      })
    );
  }

  getUserData(): User | null {
    const user: string | null = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  removeUserData(): void {
    localStorage.removeItem('user');
  }

  processRegisterLogic(signUpData: SignUpDto): Observable<TokensResponseDto> {
    return this.authApiService.register(signUpData).pipe(
      retry(3),
      catchError(error => {
        return this.errorHandlingService.handleError(error);
      }),
      map((response: TokensResponseDto) => {
        this.saveTokens(response.accessToken, response.refreshToken);
        // TODO: save user data when backend implements returning user info in response
        // this.saveUserData(response.userId, response.name, response.email);
        this.isLoggedInSubject.next(true);
        return response;
      })
    );
  }

  processLoginLogic(loginData: SignInDto): Observable<SignInResponseDto> {
    return this.authApiService.login(loginData).pipe(
      retry(3),
      catchError(error => {
        return this.errorHandlingService.handleError(error);
      }),
      map((response: SignInResponseDto) => {
        this.saveTokens(response.accessToken, response.refreshToken);
        this.saveUserData(response.userId, response.name, response.email);
        this.isLoggedInSubject.next(true);
        return response;
      })
    );
  }

  processLogoutLogic(): void {
    this.authApiService
      .logout()
      .pipe(
        retry(3),
        catchError(error => {
          return this.errorHandlingService.handleError(error);
        }),
        map(response => {
          this.removeToken('accessToken');
          this.removeToken('refreshToken');
          this.removeUserData();
          return response;
        })
      )
      .subscribe(res => {
        console.log('logout res', res);
        this.router.navigate(['/']);
      });
  }

  refreshAccessToken(): Observable<TokensResponseDto> {
    return this.authApiService.refresh().pipe(
      retry(3),
      catchError(error => {
        return this.errorHandlingService.handleError(error);
      }),
      map((response: TokensResponseDto) => {
        this.saveTokens(response.accessToken, response.refreshToken);
        return response;
      })
    );
  }
}
