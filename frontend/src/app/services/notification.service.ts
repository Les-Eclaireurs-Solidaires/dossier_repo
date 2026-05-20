import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public snackbarMessage = signal<string | null>(null);
  public snackbarType = signal<'success' | 'error'>('success');

  public showError(message: string): void {
    this.snackbarType.set("error");
    this.snackbarMessage.set(message);
    setTimeout(() => {
      if (this.snackbarMessage() === message) {
        this.snackbarMessage.set(null);
      }
    }, 5000);
  }
   public showSuccess(message: string): void {
    this.snackbarType.set("success");
    this.snackbarMessage.set(message);
    setTimeout(() => {
      if (this.snackbarMessage() === message) {
        this.snackbarMessage.set(null);
      }
    }, 5000);
  }
}
