import { inject, Injectable } from '@angular/core';
import {  Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAuthResponse } from '../../interfaces/IAuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  public httpService = inject(HttpClient);
  private readonly API_URL = '/auth';

  public register(credentials: { email: string; password: string, role: string}): Observable<IAuthResponse> {
    return this.httpService.post<IAuthResponse>(`${this.API_URL}/register`, credentials, {
      withCredentials: true,
    });
  }
}
