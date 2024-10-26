import { DestroyRef, inject, Injectable } from '@angular/core';
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
import { jwtDecode } from 'jwt-decode';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_DATA_STORAGE_KEY,
} from '../../../constants/constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private destroyRef = inject(DestroyRef);

  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private authApiService: AuthApiService,
    private errorHandlingService: ErrorHandlingService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    const token = this.getToken(ACCESS_TOKEN_STORAGE_KEY);
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const decoded = jwtDecode(token);
    console.log('decodedToken: ', decoded);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationDate = decoded.exp * 1000;
    return Date.now() > expirationDate;
  }

  saveToken(key: string, token: string): void {
    localStorage.setItem(key, token);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    this.saveToken(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    this.saveToken(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }

  getToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeToken(key: string): void {
    localStorage.removeItem(key);
  }

  saveUserData(userId: number, name: string, email: string): void {
    localStorage.setItem(
      USER_DATA_STORAGE_KEY,
      JSON.stringify({
        userId,
        name,
        email,
      })
    );
  }

  getUserData(): User | null {
    const user: string | null = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (!user) {
      return null;
    }
    return JSON.parse(user);
  }

  removeUserData(): void {
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
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
          this.removeToken(ACCESS_TOKEN_STORAGE_KEY);
          this.removeToken(REFRESH_TOKEN_STORAGE_KEY);
          this.removeUserData();
          return response;
        }),
        takeUntilDestroyed(this.destroyRef)
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
