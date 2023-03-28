import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from 'src/app/shared/module/confirmation/confirmation.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-rewarded-users',
  templateUrl: './rewarded-users.component.html',
  styleUrls: ['./rewarded-users.component.scss']
})
export class RewardedUsersComponent implements OnInit {

  _unsubscribeAll: Subject<any> = new Subject();

  displayedColumns: string[] = ['name', 'email', 'phone_number', 'account_balance', 'child_count'];
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<any>();
  query: any;

  searchTimeOutRef: any;

  constructor(
    private _http: HttpClient,
    private userService: UserService,
    private loader: LoaderService,
    private snackbarService: SnackbarService,
    private _confirmationService: FuseConfirmationService
  ) { }

  ngOnInit(): void {
    this.getRewardedUsers();
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  refreshTable() {
    if (this.searchTimeOutRef) clearTimeout(this.searchTimeOutRef);
    this.searchTimeOutRef = setTimeout(() => {
      this.getRewardedUsers(this.query);
    }, 300);
  }

  getRewardedUsers(query = null) {
    this.loader.open();
    this.userService.getRewardedUser(query).pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      if (response) {
        const { result } = response;
        this.dataSource.data = result;
      }
      this.isLoading = false;
      this.loader.close();
    });
  }
}
