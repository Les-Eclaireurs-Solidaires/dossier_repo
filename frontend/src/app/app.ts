import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal<string>('');
  private http = inject(HttpClient);

  constructor() {
    this.http.get<{ message: string }>("http://localhost:3000/api").subscribe({
      next: (res) =>{
      this.title.set(res.message);
    },
    error: (err) => {
      console.error(err);
      this.title.set("Erreur lors de la récupération du message")
    }
  });
  }
}
