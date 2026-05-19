import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IUserIdentity } from '../../models/IUserIdentity';
import { LoginRequest } from '../../models/LoginRequest';
import { NotificationService } from '../notification.service';
import { RegisterRequest } from '../../models/RegisterRequest';
import { IUserProfile } from '../../models/IUserProfile';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private authApiService = inject(AuthApiService);
  private notificationService = inject(NotificationService);

  private _currentUser = signal<IUserIdentity | null>(null);
  public currentUser = this._currentUser.asReadonly();

  private _userProfile = signal<IUserProfile | null>(null);
  public userProfile = this._userProfile.asReadonly();

  public isAuthenticated = computed(() => this.currentUser() !== null);

  public updateState(userIdentity: IUserIdentity | null) {
    this._currentUser.set(userIdentity);
  }

  public updateUserProfile(userProfile: IUserProfile | null) {
    this._userProfile.set(userProfile);
  }

  public register(credentials: RegisterRequest): Observable<IUserIdentity | null> {
    return this.authApiService.register(credentials).pipe(
      tap((authData) => {
        this.updateState(authData);
        this.notificationService.showSuccess('Registration successful');
      }),
      catchError((err) => {
        this.updateState(null);
        this.notificationService.showError('Registration failed');
        return throwError(() => err);
      }),
    );
  }

  public login(credentials: LoginRequest): Observable<IUserIdentity | null> {
    return this.authApiService.login(credentials).pipe(
      tap((userIdentity) => {
        this.updateState(userIdentity);
        this.notificationService.showSuccess('Login successful');
      }),
      catchError((err) => {
        this.updateState(null);
        this.notificationService.showError('Invalid credentials');
        return throwError(() => err);
      }),
    );
  }

  public logout(): Observable<any> {
    return this.authApiService.logout().pipe(
      tap(() => {
        this.updateState(null);
        this.notificationService.showSuccess('Logout successful');
      }),
      catchError((err) => {
        this.notificationService.showError('Logout failed');
        this.updateState(null);
        return throwError(() => err);
      }),
    );
  }

  public refresh(): Observable<IUserIdentity | null> {
    return this.authApiService.refresh().pipe(
      tap((userIdentity) => {
        this.updateState(userIdentity);
      }),
      catchError((err) => {
        this.updateState(null);
        return throwError(() => err);
      }),
    );
  }

  public getUser(): Observable<IUserProfile | null> {
    return this.authApiService.getUser().pipe(
      tap((userProfile) => {
        this.updateState(userProfile);
        this.updateUserProfile(userProfile);
      }),
      catchError((err) => {
        this.updateState(null);
        this.updateUserProfile(null);
        return throwError(() => err);
      }),
    );
  }

  public forgotPassword(email: string): Observable<void> {
    return this.authApiService.forgotPassword(email).pipe(
      tap(() => {
        this.notificationService.showSuccess('Si cette adresse est valide, un email a été envoyé.');
      }),
      catchError((err) => {
        this.notificationService.showError('Une erreur est survenue lors de la demande.');
        return throwError(() => err);
      }),
    );
  }

  public resetPassword(token: string, password: string): Observable<void> {
    return this.authApiService.resetPassword(token, password).pipe(
      tap(() => {
        this.notificationService.showSuccess(
          'Votre mot de passe a été modifié avec succès. Vous pouvez vous connecter.',
        );
      }),
      catchError((err) => {
        this.notificationService.showError('Le lien de réinitialisation est invalide ou a expiré.');
        return throwError(() => err);
      }),
    );
  }
}
