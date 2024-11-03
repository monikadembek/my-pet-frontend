import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthResponseDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  TokensResponseDto,
} from '../models/auth-models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_URLS } from '../../../constants/api-urls.constants';
import { ApiResponse } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(signUpData: SignUpDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(
      `${this.apiUrl}${API_URLS.USER_REGISTER}`,
      signUpData
    );
  }

  login(signInDto: SignInDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(
      `${this.apiUrl}${API_URLS.USER_LOGIN}`,
      signInDto
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}${API_URLS.USER_LOGOUT}`);
  }

  refresh(): Observable<TokensResponseDto> {
    return this.http.get<TokensResponseDto>(
      `${this.apiUrl}${API_URLS.TOKEN_REFRESH}`
    );
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}${API_URLS.FORGOT_PASSWORD}`,
      { email }
    );
  }

  resetPassword(resetPasswordDto: ResetPasswordDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}${API_URLS.RESET_PASSWORD}`,
      resetPasswordDto
    );
  }

  deleteAccount(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}${API_URLS.DELETE_ACCOUNT}`
    );
  }
}
