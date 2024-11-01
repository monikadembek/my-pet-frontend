import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from '../../../models/models';
import { RouterLink } from '@angular/router';
import { ImageSliderComponent } from '../../../../shared/components/image-slider/image-slider.component';
import { Slide } from '../../../../shared/components/image-slider/models';
import { SLIDES } from '../../../../constants/constants';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RouterLink,
    ImageSliderComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  emailInput = '';
  errorMsg = '';
  requestProcessing = false;
  formSent = false;

  slides: Slide[] = SLIDES;

  destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.requestProcessing = true;
      const email = form.controls['email'].value;

      this.authService
        .processForgotPasswordLogic(email)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: ApiResponse) => {
            console.log('subscribe - next callback ', response);
            this.requestProcessing = false;
            this.formSent = true;
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
