import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit() {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticaed => (this.userIsAuthenticated = isAuthenticaed));
  }

  onLogout() {
    this.authService.logout();
  }
}
