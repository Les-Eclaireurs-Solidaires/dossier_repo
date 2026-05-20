import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { IUserIdentity } from '../../models/IUserIdentity';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let mockAuthStateService: any;
  let mockRouter: any;
  let mockNotificationService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const mockAuthResponse: IUserIdentity = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@test.com',
      role: 3,
    };

    mockAuthStateService = {
      register: vi.fn().mockReturnValue(of(mockAuthResponse)),
    };
    mockRouter = { navigate: vi.fn() };
    mockNotificationService = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };
    mockActivatedRoute = {
      queryParams: of({ role: 'organizer' }),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: Router, useValue: mockRouter },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    mockActivatedRoute.queryParams = of({ role: 'organizer' });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
    expect(component.currentRole()).toBe('organisateur');
  });

  it("devrait avoir un formulaire invalide à l'initialisation", () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('devrait rendre le formulaire valide si tous les champs sont correctement remplis', () => {});

  it("devrait appeler le service et rediriger lors d'une soumission valide", () => {});
});
