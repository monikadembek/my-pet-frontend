import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { confirmPasswordValidator } from '../../../validators/confirm-password.validator';
import { SignUpDto, TokensResponseDto } from '../../models/auth-models';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DividerModule } from 'primeng/divider';
import { NotificationsService } from '../../../services/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageSliderComponent } from '../../../../shared/components/image-slider/image-slider.component';
import { Slide } from '../../../../shared/components/image-slider/models';
import { SLIDES } from '../../../../constants/constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    DividerModule,
    ImageSliderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg = '';
  requestProcessing = false;
  strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?/~`|\\])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>?/~`|\\]{8,}$/;

  slides: Slide[] = SLIDES;

  destroyRef = inject(DestroyRef);

  get name(): FormControl {
    return this.registerForm.get('name') as FormControl<string>;
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl<string>;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl<string>;
  }

  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl<string>;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(256),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, Validators.maxLength(256)],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(256),
            Validators.pattern(this.strongPasswordRegex),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: confirmPasswordValidator }
    );
  }

  onSubmit(): void {
    console.log('form: ', this.registerForm);
    console.log('form value: ', this.registerForm.value);
    console.log('is form valid: ', this.registerForm.valid);
    if (this.registerForm.invalid) {
      // make all fields dirty to show error messages
      this.name.markAsDirty();
      this.email.markAsDirty();
      this.password.markAsDirty();
      this.confirmPassword.markAsDirty();

      this.notificationsService.showError(
        'Form contains errors, please correct them'
      );
    }

    if (this.registerForm.valid) {
      this.requestProcessing = true;

      const signUpData: SignUpDto = {
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
      };

      this.authService
        .processRegisterLogic(signUpData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: TokensResponseDto) => {
            console.log('subscribe - next callback ', response);
            this.requestProcessing = false;
            this.registerForm.reset();
            this.notificationsService.showSuccess(
              'You have successfully created account'
            );
            this.router.navigate(['dashboard']);
          },
          error: error => {
            console.log('subscribe - error callback ', error);
            this.errorMsg = error;
            this.requestProcessing = false;
          },
        });
    }
  }
}
