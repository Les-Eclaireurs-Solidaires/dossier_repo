import { Component, inject, signal } from '@angular/core';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/LoginRequest';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  public currentRole = signal<string>('');

  loginForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    },
  );

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    const payload: LoginRequest = {
      email,
      password,
    };

    this.authStateService.login(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => this.notificationService.showError(error.message),
    });
  }
}
