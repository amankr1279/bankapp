import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  usrName = ""
  usrBalance = 0
  usrAccnt = 0
  constructor() { }
  setName(data: string) {
    this.usrName = data;
  }
  setBalance(data: number) {
    this.usrBalance = data;
  }
  setAccnt(data: number) {
    this.usrAccnt = data;
  }
  getName() {
    return this.usrName
  }
  getBalance() {
    return this.usrBalance
  }
  getAccnt() {
    return this.usrAccnt
  }

}
