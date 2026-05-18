import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IAuthResponse } from '../../interfaces/IAuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authApiService = inject(AuthApiService);

  private _currentUser = signal<IAuthResponse | null>(null);
  public currentUser = this._currentUser.asReadonly();

  public isAuthenticated = computed(() => this.currentUser() !== null);

  public updateState(authResponse: IAuthResponse | null) {
    this._currentUser.set(authResponse);
  }

  public register(credentials: {
    email: string;
    password: string;
    role: string;
  }): Observable<IAuthResponse | null> {
    return this.authApiService.register(credentials).pipe(
      tap((authData) => {
        this.updateState(authData);
      }),
      catchError((err) => {
        this.updateState(null);
        return throwError(() => err);
      }),
    );
  }
}
