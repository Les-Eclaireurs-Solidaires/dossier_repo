import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    const mockAuthStateService = {
      resetPassword: vi.fn().mockReturnValue(of({}))
    };

    const mockRouter = {
      navigate: vi.fn()
    };

    const mockActivatedRoute = {
      snapshot: {
        queryParams: { token: 'faux-token-de-test-123' }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
