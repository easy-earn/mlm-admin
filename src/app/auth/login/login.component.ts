import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Constant } from 'src/app/shared/constants/app.constant';
import * as loginSchema from "./login.schema.json";
import Ajv from 'ajv';
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/shared/services/loader.service';

const ajv = new Ajv({ $data: true, allErrors: true });
addFormats(ajv);
addErrors(ajv);
const validator = ajv.compile(loginSchema);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constant: any = Constant;

  form: any = {
    email: "",
    password: "",
  }
  _unsubscribeAll: Subject<any> = new Subject();
  errors: any = {};

  constructor(
    private _authService: AuthService,
    private _snackbarService: SnackbarService,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
  }

  doLogin(form: any) {
    console.log("login", form);
    const isValid: any = validator(this.form);
    if (isValid) {
      this.loader.open();
      this.errors = {};
      let body = Object.assign({}, this.form);
      this._authService.signIn(body).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        if (response) {
          if (response?.message) {
            this._snackbarService.showSuccess(response?.message)
          }
          this.loader.close();
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
          this.router.navigateByUrl(redirectURL);
        }
      }, error => {
        console.log('error', error);
        error?.error?.message && this._snackbarService.showError(error?.error?.message, '', 6);
        this.loader.close();
      });
    } else {
      this.errors = {};
      validator.errors?.map(error => {
        this.errors[error['instancePath']] = error.message;
      })
      this._snackbarService.showError("Please enter valid detail.")
    }
  }
}
