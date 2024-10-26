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
import { API_URLS } from '../../../constants/api-urls.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(signUpData: SignUpDto): Observable<TokensResponseDto> {
    return this.http.post<TokensResponseDto>(
      `${this.apiUrl}${API_URLS.USER_REGISTER}`,
      signUpData
    );
  }

  login(signInDto: SignInDto): Observable<SignInResponseDto> {
    return this.http.post<SignInResponseDto>(
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
}
