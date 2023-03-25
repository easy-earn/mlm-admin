import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/shared/constants/app.constant';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import * as forgotPasswordSchema from "./forgot-password.schema.json";
import Ajv from 'ajv';
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";

const ajv = new Ajv({ $data: true, allErrors: true });
addFormats(ajv);
addErrors(ajv);
const validator = ajv.compile(forgotPasswordSchema);

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constant: any = Constant;

  form: any = {
    email: "",
    otp: "",
    password: "",
    cpassword: ""
  }

  isInitialEmailSent: boolean = false;

  _unsubscribeAll: Subject<any> = new Subject();
  errors: any = {};

  constructor(private _authService: AuthService, private _snackbarService: SnackbarService, private router: Router) { }

  ngOnInit(): void {
  }

  getEmailToRecoverPassword() {
    if (this.form?.email) {
      this._authService.recoverPassword(this.form?.email).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        if (response && response?.message) {
          this.isInitialEmailSent = true;
          this._snackbarService.showSuccess(response?.message)
        }
      }, error => {
        console.log('forgot password : error', error);
        error?.error?.message && this._snackbarService.showError(error?.error?.message);
      })
    } else {
      this._snackbarService.showError("Email is required.");
    }
  }

  resetPassword() {
    try {
      const isValid: any = validator(this.form);
      if (isValid) {
        // Signup api cal
        this.errors = {};
        let body = Object.assign({}, this.form);
        delete body['cpassword'];
        this._authService.resetPassword(this.form).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          if (response && response?.message) {
            this._snackbarService.showSuccess(response?.message)
            this.router.navigate(["/auth/login"]);
          }
        }, error => {
          console.log('error', error);
          error?.error?.message && this._snackbarService.showError(error?.error?.message, '', 6);
        });
      } else {
        this.errors = {};
        console.log('validator.errors', validator.errors);
        validator.errors?.map(error => {
          this.errors[error['instancePath']] = error.message;
        })
      }
    } catch (error: any) {
      this._snackbarService.showError(error.message);
    }
  }
}
