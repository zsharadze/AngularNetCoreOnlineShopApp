import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RegisterModel } from './../../../models/register.model';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import * as AuthActions from './../../../store/actions/authActions';
import { Actions, ofType } from '@ngrx/effects';
import { HeaderComponent } from '../../shared/header/header.component';
import { clearToastMessages } from '../../../shared/helpers/toast-message-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private actions$: Actions,
    private toastrService: ToastrService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        registerAsAdmin: [false, Validators.required],
      },
      { validators: RegisterComponent.passwordMatch }
    );
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(AuthActions.registerSuccess))
      .subscribe((data: any) => {
        clearToastMessages(this.toastrService);
        this.registerSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      });
  }

  register() {
    this.registerSuccess = false;
    if (this.registerForm.invalid) {
      console.log('form is invalid');
      return;
    }

    let registerModel: RegisterModel = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value,
      registerAsAdmin: this.registerForm.get('registerAsAdmin')?.value,
    };
    
    this.store.dispatch(
      AuthActions.register({
        register: registerModel,
      })
    );
  }

  static passwordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.value.password;
    const confirm = group.value.confirmPassword;
    return password === confirm ? null : { matchingError: true };
  }
}
