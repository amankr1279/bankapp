import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  usrName = ""
  usrAccnt_num = 0
  constructor() { }
  setName(data: string) {
    this.usrName = data;
  }
  setAccnt(data: number) {
    this.usrAccnt_num = data;
  }
  getName() {
    return this.usrName
  }
  getAccnt() {
    return this.usrAccnt_num
  }

}
