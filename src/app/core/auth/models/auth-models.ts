export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export interface TokensResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
  name: string;
}

export interface User {
  userId: number;
  email: string;
  name: string;
}

export interface ResetPasswordDto {
  resetPasswordToken: string;
  password: string;
}
