import { Component, inject, signal } from '@angular/core';
import { AuthStateService } from '../../../services/authentication/auth-state.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  imports: [RouterLink],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {
  public authStateService = inject(AuthStateService)
  public router = inject(Router);
  public isMobileMenuOpen = signal(false);
  public isUserMenuOpen = signal(false);
  public isAuthenticated = this.authStateService.isAuthenticated;


  toggleMobileMenu() {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }
  toggleUserMenu() {
    this.isUserMenuOpen.update((isOpen) => !isOpen);
  }
  logout() {
    this.authStateService.logout().subscribe({
      next: () => {
        this.isUserMenuOpen.set(false);
        this.router.navigate(['/login']);
    }});
  }
}
