import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { matchFieldsValidator } from '../../shared/validators/passwordMatchValidator';
import { RegisterRequest } from '../../models/RegisterRequest';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private authStateService = inject(AuthStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public currentRole = signal<string>('bénévole');

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
      if (roleParam === 'ORGANIZER') {
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

    const payload: RegisterRequest = {
      email,
      password,
      role: this.currentRole() === 'organisateur' ? 'ORGANIZER' : 'VOLUNTEER',
    };

    this.authStateService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
    });
  }
}
