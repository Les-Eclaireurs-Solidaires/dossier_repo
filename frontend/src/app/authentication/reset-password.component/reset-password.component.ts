import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { matchFieldsValidator } from '../../shared/validators/passwordMatchValidator';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password.component',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  public authStateService = inject(AuthStateService);
  public route = inject(Router);
  public resetPasswordToken = inject(ActivatedRoute).snapshot.queryParams['token'];

  public isLoading = signal<boolean>(false);
  public resetForm = new FormGroup(
    {
      password: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required]),
    },
    { validators: matchFieldsValidator('password', 'confirmPassword') },
  );

  constructor() {
    if (!this.resetPasswordToken) {
      this.route.navigate(['/login']);
    }
  }


  onSubmit() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const password = this.resetForm.value.password;
    if (!password) return;

    this.isLoading.set(true);

    this.authStateService
      .resetPassword(this.resetPasswordToken,password)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.route.navigate(['/login']);
        },
        error: (error) => {},
      });
  }
}
