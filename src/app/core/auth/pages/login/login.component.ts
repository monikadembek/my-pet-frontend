import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthResponseDto, SignInDto } from '../../models/auth-models';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageSliderComponent } from '../../../../shared/components/image-slider/image-slider.component';
import { SLIDES } from '../../../../constants/constants';
import { Slide } from '../../../../shared/components/image-slider/models';

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
    ImageSliderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  emailInput = '';
  passwordInput = '';
  errorMsg = '';
  requestProcessing = false;

  slides: Slide[] = SLIDES;

  destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    console.log('form: ', form);
    if (form.valid) {
      const loginData: SignInDto = {
        email: form.controls['email'].value,
        password: form.controls['password'].value,
      };
      this.authService
        .processLoginLogic(loginData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: AuthResponseDto) => {
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
