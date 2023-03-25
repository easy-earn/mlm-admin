import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from 'src/app/shared/module/confirmation/confirmation.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  _unsubscribeAll: Subject<any> = new Subject();

  displayedColumns: string[] = ['name', 'email', 'upi', 'utr', 'plan_amount', 'plan_amount_without', 'transaction_verified', 'status', 'actions'];
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
    private userService: UserService,
    private loader: LoaderService,
    protected _confirmationService: FuseConfirmationService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  pageChange(event: any) {
    this.isLoading = true;
    return this.getTransactions(
      event.pageIndex,
      event.pageSize,
      this.sortObj?.active,
      this.sortObj?.direction,
      this.filterObj
    )
  }


  getTransactions(page: any = 0, size: any = 25, sort: any = null, direction: any = 'asc', filter: any = null) {
    this.loader.open();
    this.userService.getTransactions(page, size, sort, direction, filter).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response) {
        const { result, count } = response;
        count ? this.pagination.length = count : null;
        this.dataSource.data = result;
      }
      this.isLoading = false;
      this.loader.close();
    });
  }

  verifyTransaction(tr: any) {
    const confirmation = this._confirmationService.open({
      title: 'Confirm Payment',
      message:
        'Are you sure you want confirm this transaction?',
      icon: {
        show: true,
        name: 'warning',
        color: 'warning',
      },
      actions: {
        confirm: {
          show: true,
          label: 'Yes, Verify',
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
        this.userService.verifyTransaction(tr.usertransaction_id).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
          if (response) {
            this.loader.close();
            this.getTransactions(this.pagination.page, this.pagination.size, this.sortObj?.active, this.sortObj?.direction);
            this.snackbarService.showSuccess("Transaction Verified Successfully.")
          }
        })
      }
    });
  }


}
