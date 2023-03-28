import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, takeUntil } from 'rxjs';
import { Constant } from '../constants/app.constant';
import { ApiResponse } from '../types/api.types';
import { UtilityService } from './utility.service';
const api = Constant.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public _httpClient: HttpClient, public utils: UtilityService) { }

  getUsers(page: number = 0, size: number = 25, sort: any = null, direction: any = null, filter: any = null) {
    const offset = this.utils.getOffset(page, size);
    const params: any = {
      'option[offset]': offset,
      'option[limit]': size,
    }
    if (sort && direction) {
      params[`option[sort][${sort}]`] = direction;
    }
    if (filter && 'field' in filter && filter['field'] && 'operator' in filter && filter['operator'] && 'value' in filter && filter['value']) {
      params[`option[search][${filter.field}][${filter.operator}]`] = filter.value;
    }

    return this._httpClient.get<ApiResponse<any>>(`${api}/admin/users`, { params }).pipe(catchError(error => of(null)))
  }

  // Not In Use (Instead of calcualte fresh count from data, we are using child_count saved in user table)
  getRewardedUser(maxCount: any = null) {
    const params: any = {};
    if (maxCount) {
      params[`childCount`] = maxCount;
    }
    return this._httpClient.get<ApiResponse<any>>(`${api}/admin/rewarded-users`, { params }).pipe(catchError(error => of(null)))
  }

  getTransactions(page: number = 0, size: number = 25, sort: any = null, direction: any = null, filter: any = null) {
    const offset = this.utils.getOffset(page, size);
    const params: any = {
      'option[offset]': offset,
      'option[limit]': size,
    }
    if (sort && direction) {
      params[`option[sort][${sort}]`] = direction;
    }
    if (filter && 'field' in filter && filter['field'] && 'operator' in filter && filter['operator'] && 'value' in filter && filter['value']) {
      params[`option[search][${filter.field}][${filter.operator}]`] = filter.value;
    }

    return this._httpClient.get<ApiResponse<any>>(`${api}/admin/transactions`, { params }).pipe(catchError(error => of(null)))
  }

  verifyTransaction(transactionId: string) {
    return this._httpClient.post<ApiResponse<any>>(`${api}/admin/verify-user-purchase`, { transaction_id: transactionId }).pipe(catchError(error => of(null)))
  }

  withdrawBalance(user_id: string) {
    return this._httpClient.post<ApiResponse<any>>(`${api}/admin/withdraw-balance`, { user_id })
  }

  updateUserStatus(user_id: string, status: 0 | 1 = 1) {
    return this._httpClient.put<ApiResponse<any>>(`${api}/admin/update-status/${user_id}`, { status: status });
  }
}
