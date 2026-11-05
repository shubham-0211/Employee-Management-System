import { Component, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { APP_VERSION } from './version';
import { AuthService } from './services/auth.service';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly appVersion = APP_VERSION;

  readonly isLoginPage = toSignal(
    this.router.events.pipe(
      filter(
        (event): event is NavigationEnd =>
          event instanceof NavigationEnd
      ),
      map((event) => event.urlAfterRedirects === '/login'),
      startWith(this.router.url === '/login')
    ),
    {
      initialValue: this.router.url === '/login',
    }
  );

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get canManageEmployees(): boolean {
    return this.authService.hasRole(['ADMIN', 'HR']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}