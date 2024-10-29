import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../../validators/confirm-password.validator';
import { NotificationsService } from '../../../services/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResponse } from '../../../models/models';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RouterLink,
    DividerModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  errorMsg = '';
  requestProcessing = false;
  strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>?/~`|\\])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>?/~`|\\]{8,}$/;
  formSent = false;
  tokenExists = true;

  destroyRef = inject(DestroyRef);

  get password(): FormControl {
    return this.resetPasswordForm.get('password') as FormControl<string>;
  }

  get confirmPassword(): FormControl {
    return this.resetPasswordForm.get('confirmPassword') as FormControl<string>;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.tokenExists = this.isTokenAvailable();
  }

  private getToken(): string {
    return this.route.snapshot.queryParamMap.get('resetPasswordToken') || '';
  }

  private isTokenAvailable(): boolean {
    return this.getToken() ? true : false;
  }

  private buildForm(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
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
    console.log('reset password form: ', this.resetPasswordForm);
    if (this.resetPasswordForm.invalid) {
      // make all fields dirty to show error messages
      this.password.markAsDirty();
      this.confirmPassword.markAsDirty();
    }

    if (this.resetPasswordForm.valid) {
      this.requestProcessing = true;
      this.authService
        .processResetPasswordLogic(this.getToken(), this.password.value)
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
