import { Component, OnInit } from '@angular/core';
import { Constant } from 'src/app/shared/constants/app.constant';
import * as signupJSONSchema from "./signup-form.schema.json";
import Ajv from 'ajv';
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';


const ajv = new Ajv({ $data: true, allErrors: true });
addFormats(ajv);
addErrors(ajv);
const validator = ajv.compile(signupJSONSchema);

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {


  constant: any = Constant;
  _unsubscribeAll: Subject<any> = new Subject();

  planList: any = [];

  form: any = {
    name: "",
    email: "",
    password: "",
    cpassword: "",
    sec_code: ""
  }
  verifyForm: any = {
    otp: ''
  }

  isSignupDone: boolean = false;

  // Messages
  errors: any = {};

  constructor(private authService: AuthService,
    private _snackbarService: SnackbarService,
    private router: Router,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
  }

  signup() {
    try {
      console.log('this.form', this.form);
      const isValid: any = validator(this.form);
      console.log(isValid, validator.errors);
      if (isValid) {
        // Signup api cal
        this.loader.open();
        this.errors = {};
        let body = Object.assign({}, this.form);
        delete body['cpassword'];
        this.authService.signup(this.form).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          console.log('result', response);
          if (response) {
            const { result } = response;
            if (result) {
              const { access_token, userDoc } = result;
              this.authService.adminAccessToken = access_token;
              this.authService.user = userDoc;
              this.isSignupDone = true;
            }
          }
          this.loader.close();
        }, error => {
          console.log('error', error);
          error?.error?.message && this._snackbarService.showError(error?.error?.message, '', 6);
          this.loader.close();
        });
      } else {
        this.errors = {};
        console.log('validator.errors', validator.errors);
        validator.errors?.map(error => {
          this.errors[error['instancePath']] = error.message;
        })
        this._snackbarService.showError("Please enter a valid details.")
      }
    } catch (error: any) {
      this._snackbarService.showError(error.message);
    }
  }

  resendOTP() {
    this.loader.open();
    this.authService.resendOTP(this.form.email).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response) {
        const { message } = response;
        console.log('result', message);
        this._snackbarService.showInfo(message);
      }
      this.loader.close();
    }, error => {
      console.log('error', error);
      error?.error?.message && this._snackbarService.showError(error?.error?.message, '', 6);
      this.loader.close();
    });
  }

  verifyOTP() {
    if (this.verifyForm.otp && this.verifyForm.otp != null && this.verifyForm.otp != undefined && this.verifyForm.otp != '') {
      this.loader.open();
      this.authService.verifyOTP(this.form.email, this.verifyForm.otp).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        if (response) {
          const { message } = response;
          console.log('result', message);
          this.loader.close();
          if (this.form.package && this.form.package.plan_id) {
            this.router.navigate([`/dashboard/plans?planId=${this.form.package.plan_id}`]);
          } else {
            this.router.navigate([`/dashboard/home`]);
          }
          this._snackbarService.showSuccess(message);
        }
      }, error => {
        console.log('error', error);
        error?.error?.message && this._snackbarService.showError(error?.error?.message, '', 6);
        this.loader.close();
      });
    }
  }

}
