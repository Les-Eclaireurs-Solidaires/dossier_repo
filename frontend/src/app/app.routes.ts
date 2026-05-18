import { Routes } from '@angular/router';
import { RegisterComponent } from './authentication/register.component/register.component';
import { AuthenticationPage } from './authentication/authentication.page/authentication.page';

export const routes: Routes = [
  {
    path: 'login',
    component: AuthenticationPage,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
];
