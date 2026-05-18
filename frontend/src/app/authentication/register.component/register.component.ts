import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { matchFieldsValidator } from '../../shared/validators/passwordMatchValidator';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);

  public currentRole = signal<string>('');

  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      acceptTerms: new FormControl(false, [Validators.requiredTrue]),
    },
    {
      validators: matchFieldsValidator('password', 'confirmPassword'),
    },
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const roleParam = params['role'];
      if (roleParam === 'organizer') {
        this.currentRole.set('organisateur');
      } else {
        this.currentRole.set('bénévole');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;

    const payload = {
      email,
      password,
      role: this.currentRole() === 'organisateur' ? 'ORGANIZER' : 'VOLUNTEER',
    };

    this.authStateService.register(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Compte créé, vous êtes maintenant connecté !');
        this.router.navigate(['/']);
      },
      error: (error) => this.notificationService.showError(error.message),
    });
  }
}
