import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password.component',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  public authStateService = inject(AuthStateService);
  public isLoading = signal<boolean>(false);
  public forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    const email = this.forgotForm.value.email;
    if (!email) return;

    this.isLoading.set(true);

    this.authStateService
      .forgotPassword(email)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.forgotForm.reset();
        },
        error: (error) => {},
      });
  }
}
