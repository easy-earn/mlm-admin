import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '../shared/module/media-watcher/media-watcher.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isScreenSmall: boolean = false;
  _unsubscribeAll: Subject<any> = new Subject();

  navLinks: Array<any> = [
    { routerLink: '/dashboard/home', label: 'Users' },
    { routerLink: '/dashboard/transaction', label: 'Transactions' },
    { routerLink: '/dashboard/withdraw-request', label: 'Withdraw Requests' }
  ]

  constructor(private _router: Router, private authService: AuthService, private _fuseMediaWatcherService: FuseMediaWatcherService) {
  }

  ngOnInit(): void {
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  logout() {
    localStorage.clear();
    this.authService.signOut().pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
      this._router.navigate(['/auth/login']);
    })
  }

}
