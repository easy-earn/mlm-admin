import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from 'src/app/shared/module/confirmation/confirmation.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { WithdrawHistoryService } from 'src/app/shared/services/withdraw-history.service';


@Component({
  selector: 'app-withdraw-history',
  templateUrl: './withdraw-history.component.html',
  styleUrls: ['./withdraw-history.component.scss']
})
export class WithdrawHistoryComponent implements OnInit {

  _unsubscribeAll: Subject<any> = new Subject();

  displayedColumns: string[] = ['name', 'email', 'phone_number', 'amount'];
  isLoading: boolean = false;
  pagination: any = {
    length: 0,
    page: 0,
    size: 25
  }
  dataSource = new MatTableDataSource<any>();
  sortObj: any = {};
  filterObj = {
    field: null,
    operator: null,
    value: null
  }
  filterTimeoutRef: any = null;

  searchFields = ['amount'];
  operators = [
    { value: 'eq', label: 'Is' },
    { value: 'lt', label: 'Less than' },
    { value: 'lte', label: 'Less than or equal to' },
    { value: 'gt', label: 'Greater than' },
    { value: 'gte', label: 'Greater than or equal to' },
  ]


  constructor(
    private _http: HttpClient,
    private withdrawHistoryService: WithdrawHistoryService,
    private loader: LoaderService,
    private snackbarService: SnackbarService,
    private _confirmationService: FuseConfirmationService
  ) { }

  ngOnInit(): void {
    this.getAllHistory();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  pageChange(event: any) {
    this.isLoading = true;
    return this.getAllHistory(
      event.pageIndex,
      event.pageSize,
      this.sortObj?.active,
      this.sortObj?.direction,
      this.filterObj
    )
  }

  sortData(event: any) {
    this.isLoading = true;
    this.sortObj.active = event.active;
    this.sortObj.direction = event.direction;
    return this.getAllHistory(
      this.pagination.page,
      this.pagination.size,
      this.sortObj?.active,
      this.sortObj?.direction,
      this.filterObj
    )
  }

  filterUser() {
    if (this.filterTimeoutRef) clearTimeout(this.filterTimeoutRef);
    this.filterTimeoutRef = setTimeout(() => {
      if (this.filterObj?.field && this.filterObj?.operator && this.filterObj?.value) {
        this.getAllHistory(
          0,
          25,
          this.sortObj?.active,
          this.sortObj?.direction,
          this.filterObj
        );
      }
    }, 300);
  }

  clearFilter() {
    this.filterObj = {
      field: null,
      operator: null,
      value: null
    };
    this.getAllHistory(0, 25, this.sortObj?.active, this.sortObj?.direction, this.filterObj);
  }


  getAllHistory(page: any = 0, size: any = 25, sort: any = null, direction: any = 'asc', filter: any = null) {
    this.loader.open();
    this.withdrawHistoryService.getWithdrawHistory(page, size, sort, direction, filter).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response) {
        const { result, count } = response;
        count ? this.pagination.length = count : null;
        this.dataSource.data = result;
      }
      this.isLoading = false;
      this.loader.close();
    });
  }
}
