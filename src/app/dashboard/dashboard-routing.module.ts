import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { WithdrawRequestComponent } from './withdraw-request/withdraw-request.component';
import { WithdrawHistoryComponent } from './withdraw-history/withdraw-history.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: DashboardComponent,
    children: [
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "transaction",
        component: TransactionComponent
      },
      {
        path: "withdraw-request",
        component: WithdrawRequestComponent
      },
      {
        path: "withdraw-history",
        component: WithdrawHistoryComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "**",
        redirectTo: "home"
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
