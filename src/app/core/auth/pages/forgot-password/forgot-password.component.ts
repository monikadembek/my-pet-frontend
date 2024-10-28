import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  emailInput = '';
  errorMsg = '';
  requestProcessing = false;
  formSent = false;

  destroyRef = inject(DestroyRef);

  constructor(private authService: AuthService) {}

  onSubmit(form: NgForm): void {
    console.log('form: ', form);
    if (form.valid) {
      // TODO: make call to backend to send user email
      // if request is successfull hide form and show information to check inbox
      // else show errors
    }
  }
}
