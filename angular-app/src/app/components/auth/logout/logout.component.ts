import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { Router } from '@angular/router';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import * as AuthActions from './../../../store/actions/authActions';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  logoutInterval: any;
  logoutingText = 'Logouting.';
  count = 1;
  constructor(private router: Router, 
    private store: Store<AppState>) {}
  ngOnInit() {
    this.store.dispatch(AuthActions.setUnauthenticated());
    this.logoutInterval = setInterval(() => {
      this.count++;
      this.logoutingText += '.';
      if (this.count == 5) {
        clearInterval(this.logoutInterval);
        this.router.navigate(['/']);
      }
    }, 500);
  }
}
