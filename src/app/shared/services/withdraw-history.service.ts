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
export class WithdrawHistoryService {

  constructor(public _httpClient: HttpClient, public utils: UtilityService) { }

  getWithdrawHistory(page: number = 0, size: number = 25, sort: any = null, direction: any = null, filter: any = null) {
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

    return this._httpClient.get<ApiResponse<any>>(`${api}/admin/withdraw-balance/history`, { params }).pipe(catchError(error => of(null)))
  }

}
