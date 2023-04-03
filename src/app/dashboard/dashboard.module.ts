import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    ProfileComponent,
    TransactionComponent,
    WithdrawRequestComponent,
    WithdrawHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: []
})
export class DashboardModule { }
