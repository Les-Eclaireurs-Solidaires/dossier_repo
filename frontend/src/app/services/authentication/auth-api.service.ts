import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUserIdentity } from '../../models/IUserIdentity';
import { LoginRequest } from '../../models/LoginRequest';
import { IUserProfile } from '../../models/IUserProfile';
import { RegisterRequest } from '../../models/RegisterRequest';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  public httpService = inject(HttpClient);
  private readonly API_URL = '/auth';

  public register(credentials: RegisterRequest): Observable<IUserIdentity> {
    return this.httpService.post<IUserIdentity>(`${this.API_URL}/register`, credentials);
  }
  public login(credentials: LoginRequest): Observable<IUserIdentity> {
    return this.httpService.post<IUserIdentity>(`${this.API_URL}/login`, credentials);
  }
  public logout(): Observable<any> {
    return this.httpService.post(`${this.API_URL}/logout`, {});
  }
  public getUser(): Observable<IUserProfile> {
    return this.httpService.get<IUserProfile>(`${this.API_URL}/me`);
  }
  public refresh(): Observable<IUserIdentity> {
    return this.httpService.post<IUserIdentity>(`${this.API_URL}/refresh`, {});
  }
  public forgotPassword(email: string): Observable<void> {
    return this.httpService.post<void>('/auth/forgot-password', { email });
  }

  public resetPassword(token: string, password: string): Observable<void> {
    return this.httpService.post<void>('/auth/reset-password', { token, password });
  }
}
