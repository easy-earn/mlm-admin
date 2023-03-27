import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from 'src/app/shared/module/confirmation/confirmation.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  _unsubscribeAll: Subject<any> = new Subject();

  displayedColumns: string[] = ['name', 'email', 'phone_number', 'referral_code', 'is_verified', 'transaction_verified', 'account_balance', 'plan_amount', 'status', 'actions'];
  isLoading: boolean = false;
  pagination: any = {
    length: 0,
    page: 0,
    size: 25
  }
  dataSource = new MatTableDataSource<any>();
  sortObj: any;
  filterObj = {
    field: "",
    operator: "",
    value: ""
  }

  constructor(
    private _http: HttpClient,
    private userService: UserService,
    private loader: LoaderService,
    private snackbarService: SnackbarService,
    private _confirmationService: FuseConfirmationService
  ) { }

  ngOnInit(): void {
    this.getAllUsers();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  pageChange(event: any) {
    this.isLoading = true;
    return this.getAllUsers(
      event.pageIndex,
      event.pageSize,
      this.sortObj?.active,
      this.sortObj?.direction,
      this.filterObj
    )
  }


  getAllUsers(page: any = 0, size: any = 25, sort: any = null, direction: any = 'asc', filter: any = null) {
    this.loader.open();
    this.userService.getUsers(page, size, sort, direction, filter).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response) {
        const { result, count } = response;
        count ? this.pagination.length = count : null;
        this.dataSource.data = result;
      }
      this.isLoading = false;
      this.loader.close();
    });
  }

  withdrawAmount(user: any) {
    const confirmation = this._confirmationService.open({
      title: 'Confirm Payment',
      message:
        'Are you sure you want release payment?',
      icon: {
        show: true,
        name: 'warning',
        color: 'warning',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes, Pay Now',
          color: 'primary',
          class: 'text-slate-100'
        },
        cancel: {
          show: true,
          label: 'Cancel',
        },
      },
      dismissible: true,
    });

    confirmation.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response == 'confirmed') {
        this.loader.open();
        this.userService.withdrawBalance(user.user_id).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          if (response && response.success == true) {
            this.loader.close();
            this.getAllUsers(this.pagination.page, this.pagination.size, this.sortObj.active, this.sortObj.direction);
            this.snackbarService.showSuccess("Transaction Verified Successfully.")
          }
        }, error => {
          console.log('error', error);
          if (error?.error?.error && 'not_sufficient_amount' in error?.error?.error) {
            this.snackbarService.showError("Not sufficient amount to withdraw.");
          }
          this.loader.close();
        })
      }
    });
  }

}
