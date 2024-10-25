import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  TokensResponseDto,
} from '../models/auth-models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(signUpData: SignUpDto): Observable<TokensResponseDto> {
    return this.http.post<TokensResponseDto>(
      `${this.apiUrl}/auth/signup`,
      signUpData
    );
  }

  login(signInDto: SignInDto): Observable<SignInResponseDto> {
    return this.http.post<SignInResponseDto>(
      `${this.apiUrl}/auth/login`,
      signInDto
    );
  }

  logout(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/auth/logout`);
  }

  refresh(): Observable<TokensResponseDto> {
    return this.http.get<TokensResponseDto>(`${this.apiUrl}/auth/refresh`);
  }
}
