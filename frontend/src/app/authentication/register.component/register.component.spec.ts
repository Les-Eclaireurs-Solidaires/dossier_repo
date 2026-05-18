import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthStateService } from '../../services/authentication/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { IAuthResponse } from '../../interfaces/IAuthResponse';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let mockAuthStateService: any;
  let mockRouter: any;
  let mockNotificationService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    const mockAuthResponse: IAuthResponse = {
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

  // --- À TOI DE JOUER POUR LA SUITE ---

  it('devrait rendre le formulaire valide si tous les champs sont correctement remplis', () => {
    // Ton objectif :
    // 1. Remplir component.registerForm.controls['email'].setValue('...') etc.
    // 2. Vérifier que expect(component.registerForm.valid).toBeTruthy()
  });

  it("devrait appeler le service et rediriger lors d'une soumission valide", () => {
    // Ton objectif :
    // 1. Remplir le formulaire avec des données valides.
    // 2. Appeler component.onSubmit()
    // 3. Vérifier que mockAuthStateService.register a été appelé avec les bonnes données (expect(...).toHaveBeenCalledWith(...))
    // 4. Vérifier que mockNotificationService.showSuccess a été appelé
    // 5. Vérifier que mockRouter.navigate a été appelé vers ['/']
  });
});
