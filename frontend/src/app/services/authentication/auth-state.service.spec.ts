import { TestBed } from '@angular/core/testing';
import { AuthApiService } from './auth-api.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IUserIdentity } from '../../models/IUserIdentity';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController; // 🌟 L'espion HTTP d'Angular

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login()', () => {
    it('doit envoyer une requête POST à /auth/login avec les bonnes données', () => {
      const mockPayload = { email: 'test@test.com', password: 'Password123!' };
      const mockResponse = { uuid: '123', email: 'test@test.com', role: 'VOLUNTEER' };
      let actualResponse!: IUserIdentity;

      service.login(mockPayload).subscribe(response => {
        actualResponse = response;
      });

      const req = httpMock.expectOne('/auth/login');      
      req.flush(mockResponse); 

      expect(actualResponse).toEqual(mockResponse);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPayload);
    });
  });

});