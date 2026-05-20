import { Routes } from '@angular/router';
import { RegisterComponent } from './authentication/register.component/register.component';
import { AuthenticationPage } from './authentication/authentication.page/authentication.page';
import { LoginComponent } from './authentication/login.component/login.component';
import { ForgotPasswordComponent } from './authentication/forgot-password.component/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password.component/reset-password.component';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthenticationPage,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [guestGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [guestGuard],
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
