import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }


  getOffset(page: number, size: number) {
    return size * page;
  }


}
