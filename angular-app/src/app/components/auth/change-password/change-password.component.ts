import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppState } from '../../../store/store';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ChangePasswordModel } from '../../../models/changePassword.model';
import * as AuthActions from './../../../store/actions/authActions';
import { clearToastMessages } from '../../../shared/helpers/toast-message-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  changePasswordSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private _actions$: Actions,
    private toastrService: ToastrService
  ) {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: ChangePasswordComponent.passwordMatch }
    );
  }

  ngOnInit() {
    this._actions$
      .pipe(ofType(AuthActions.changePasswordSuccess))
      .subscribe((data: any) => {
        clearToastMessages(this.toastrService);
        this.changePasswordSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      });
  }

  changePassword() {
    this.changePasswordSuccess = false;

    if (this.changePasswordForm.invalid) {
      console.log('form is invalid');
      return;
    }

    let changePasswordModel: ChangePasswordModel = {
      oldPassword: this.changePasswordForm.get('oldPassword')?.value,
      newPassword: this.changePasswordForm.get('newPassword')?.value,
      confirmPassword: this.changePasswordForm.get('confirmPassword')?.value,
    };
    this.store.dispatch(
      AuthActions.changePassword({
        changePassword: changePasswordModel,
      })
    );
  }

  static passwordMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.value.newPassword;
    const confirm = group.value.confirmPassword;
    return password === confirm ? null : { matchingError: true };
  }
}
