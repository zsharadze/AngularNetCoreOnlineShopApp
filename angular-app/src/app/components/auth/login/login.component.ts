import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginModel } from './../../../models/login.model';
import { Router } from '@angular/router';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './../../../store/actions/authActions';
import { HeaderComponent } from '../../shared/header/header.component';
import { ToastrService } from 'ngx-toastr';
import { clearToastMessages } from '../../../shared/helpers/toast-message-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  invalidLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private actions$: Actions,
    private toastrService: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.actions$
      .pipe(ofType(AuthActions.loginSuccess))
      .subscribe((data: any) => {
        clearToastMessages(this.toastrService);
        this.router.navigate(['/']);
      });
  }

  login() {
    if (this.loginForm.invalid) {
      console.log('form is invalid');
      return;
    }

    let loginModel: LoginModel = {
      username: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.store.dispatch(
      AuthActions.login({
        login: loginModel,
      })
    );
  }

  inputChange() {
    this.invalidLogin = false;
  }
}
