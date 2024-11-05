import { TestBed } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { API_URLS } from '../../../constants/api-urls.constants';
import {
  AuthResponseDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  TokensResponseDto,
} from '../models/auth-models';
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { mockJwtInterceptor } from '../../../../tests/mock-jwt.interceptor';
import { ApiResponse } from '../../models/models';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTestingController: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockJwtInterceptor])),
        provideHttpClientTesting(),
        AuthApiService,
      ],
    });

    service = TestBed.inject(AuthApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // check if there are no pending requests after each test
    // httpTestingController.verify();
    TestBed.inject(HttpTestingController).verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register user when passing valid payload in body', async () => {
      const signUpData: SignUpDto = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin1234#',
      };
      const mockResponse: AuthResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 1,
        email: 'admin@gmail.com',
        name: 'Admin',
      };

      // service.register(signUpData).subscribe(response => {
      //   expect(response).toEqual(mockResponse);
      // });

      // `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
      // and creates a `Promise` of the response.
      const responsePromise = firstValueFrom(service.register(signUpData));

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.USER_REGISTER}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signUpData);

      // Flushing the request causes it to complete, delivering the result.
      req.flush(mockResponse);

      // assert response
      expect(await responsePromise).toEqual(mockResponse);
    });

    it('should return error if password in payload is not strong password', () => {
      let actualError: HttpErrorResponse | undefined;
      const signUpData: SignUpDto = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Admin',
      };
      const mockErrorResponse = {
        status: 400,
        statusText: 'Bad request',
      };

      service.register(signUpData).subscribe({
        next: () => {
          fail('Success should not be called');
        },
        error: error => {
          actualError = error;
        },
      });

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.USER_REGISTER}`
      );

      req.flush('Bad request', mockErrorResponse);

      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      expect(actualError.status).toEqual(mockErrorResponse.status);
      expect(actualError.statusText).toEqual(mockErrorResponse.statusText);
    });
  });

  describe('login', () => {
    it('should login user when passing valid payload in body', async () => {
      const signInData: SignInDto = {
        email: 'admin@gmail.com',
        password: 'Admin1234#',
      };
      const mockResponse: AuthResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 1,
        email: 'admin@gmail.com',
        name: 'Admin',
      };

      const responsePromise = firstValueFrom(service.login(signInData));

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.USER_LOGIN}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signInData);

      req.flush(mockResponse);

      expect(await responsePromise).toEqual(mockResponse);
    });

    it('should return error when passing wrong password', () => {
      const signInData: SignInDto = {
        email: 'admin@gmail.com',
        password: 'Admin',
      };
      const mockErrorResponse = {
        status: 401,
        statusText: 'Unauthorized',
      };
      let actualError: HttpErrorResponse | undefined;

      service.login(signInData).subscribe({
        next: () => {
          fail('Success should not be called');
        },
        error: error => {
          actualError = error;
        },
      });

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.USER_LOGIN}`
      );

      req.flush('Bad request', mockErrorResponse);

      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      expect(actualError?.status).toEqual(mockErrorResponse.status);
      expect(actualError?.statusText).toEqual(mockErrorResponse.statusText);
    });
  });

  describe('logout', () => {
    it('should logout user when access token is in headers', async () => {
      const mockAccessToken = 'mock-access-token';

      const responsePromise = firstValueFrom(service.logout());

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.USER_LOGOUT}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toEqual(
        `Bearer ${mockAccessToken}`
      );

      req.flush(null);

      expect(await responsePromise).toBeFalsy();
    });
  });

  describe('deleteAccount', () => {
    it('should delete user account when access token is in headers', async () => {
      const mockAccessToken = 'mock-access-token';
      const mockResponse: ApiResponse = {
        status: 'success',
        message: 'Account for user was deleted',
        timestamp: new Date().toISOString(),
      };

      const responsePromise = firstValueFrom(service.deleteAccount());

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.DELETE_ACCOUNT}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toEqual(
        `Bearer ${mockAccessToken}`
      );

      req.flush(mockResponse);

      expect((await responsePromise).status).toEqual(mockResponse.status);
    });
  });

  describe('refresh', () => {
    it('should call refresh and get new tokens', async () => {
      const mockRefreshToken = 'mock-access-token';
      const mockResponse: TokensResponseDto = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      const responsePromise = firstValueFrom(service.refresh());

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.TOKEN_REFRESH}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toEqual(
        `Bearer ${mockRefreshToken}`
      );

      req.flush(mockResponse);

      expect(await responsePromise).toEqual(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should call forgotPassword with email in body', async () => {
      const email = 'admin@gmail.com';
      const mockResponse: ApiResponse = {
        status: 'success',
        message: `Email with link to reset password has been sent to ${email}`,
        timestamp: new Date().toISOString(),
      };

      const responsePromise = firstValueFrom(service.forgotPassword(email));

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.FORGOT_PASSWORD}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email });

      req.flush(mockResponse);

      expect(await responsePromise).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should call resetPassword with valid payload', async () => {
      const resetPasswordData: ResetPasswordDto = {
        resetPasswordToken: 'reset-password-token',
        password: 'Admin1234#',
      };
      const mockResponse: ApiResponse = {
        status: 'success',
        message: `Password has been changed for admin@gmail.com`,
        timestamp: new Date().toISOString(),
      };

      const responsePromise = firstValueFrom(
        service.resetPassword(resetPasswordData)
      );

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.RESET_PASSWORD}`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(resetPasswordData);

      req.flush(mockResponse);

      expect(await responsePromise).toEqual(mockResponse);
    });

    it('should return error if there is no token in payload', () => {
      const resetPasswordData = {
        resetPasswordToken: '',
        password: 'Admin1234#',
      };
      const mockErrorResponse = {
        status: 400,
        statusText: 'Bad request',
      };
      let actualError: HttpErrorResponse | undefined;

      service.resetPassword(resetPasswordData).subscribe({
        next: () => {
          fail('Success should not be called');
        },
        error: error => {
          actualError = error;
        },
      });

      const req = httpTestingController.expectOne(
        `${apiUrl}${API_URLS.RESET_PASSWORD}`
      );

      req.flush(mockErrorResponse);

      if (!actualError) {
        throw new Error('Error needs to be defined');
      }

      expect(actualError.status).toEqual(mockErrorResponse.status);
      expect(actualError.statusText).toEqual(mockErrorResponse.statusText);
    });
  });
});
