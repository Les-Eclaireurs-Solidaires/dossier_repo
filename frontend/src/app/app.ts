import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { NavMenuComponent } from './shared/component/nav-menu.component/nav-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NavMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public notificationService = inject(NotificationService);


}
