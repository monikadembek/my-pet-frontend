import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthApiService } from '../../services/auth-api.service';
import { SignInDto, SignInResponseDto } from '../../models/auth-models';
import { catchError, retry } from 'rxjs';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  emailInput = '';
  passwordInput = '';
  errorMsg = '';
  requestProcessing = false;

  constructor(
    private authService: AuthService,
    private errorHandlingService: ErrorHandlingService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    console.log('form: ', form);
    if (form.valid) {
      const loginData: SignInDto = {
        email: form.controls['email'].value,
        password: form.controls['password'].value,
      };
      this.authService.processLoginLogic(loginData).subscribe({
        next: (response: SignInResponseDto) => {
          console.log('subscribe - next callback ', response);
          this.requestProcessing = false;
          this.router.navigate(['/dashboard']);
        },
        error: error => {
          console.log('subscribe - error callback ', error);
          this.errorMsg = error.message;
          this.requestProcessing = false;
        },
      });
    }
  }
}
