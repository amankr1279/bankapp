import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usrName = ""
  usrBal = 0
  usrAccnt = 0
  public beneficiaryForm!: FormGroup
  public sendMoneyForm!: FormGroup
  constructor(
    private shared: SharedService,
    private formBuild: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.usrName = this.shared.getName()
    this.usrBal = this.shared.getBalance()
    this.usrAccnt = this.shared.getAccnt()
    localStorage.setItem("usrName", this.usrName)
    localStorage.setItem("usrBal", `${this.usrBal}`)
    localStorage.setItem("usrAccnt", `${this.usrAccnt}`)

    this.beneficiaryForm = this.formBuild.group({
      "accnt_num_ben": 0
    })
    this.sendMoneyForm = this.formBuild.group({
      "sendAmt": [{ value: 0, disabled: false }]
    })
  }

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }
  checkAccount() {
    this.http.post<any>("http://127.0.0.1:3000/isUser", this.beneficiaryForm.value, this.httpOptions)
      .subscribe({
        next: (nx) => {
          alert(nx.msg)
          this.usrName = this.usrName
          this.usrBal = this.usrBal
          console.log(nx)
          //this.sendMoneyForm.disable.apply(false)
        },
        error: (err) => {
          alert(err.error.msg)
          this.beneficiaryForm.reset()
        }
      })
  }

  sendMoney() {
    let x = localStorage.getItem('usrAccnt')
    let data = {
      "accnt1": Number(x),
      "accnt2": this.beneficiaryForm.value["accnt_num_ben"],
      "amt": this.sendMoneyForm.value["sendAmt"],
    }
    console.log(data)

    this.http.post<any>("http://127.0.0.1:3000/sendMoney", data)
      .subscribe({
        next: (nx) => {
          alert(nx.msg)
          this.usrName = this.usrName
          this.usrBal = this.usrBal
          console.log(nx)
        },
        error: (err) => {
          alert(err.error.msg)
          this.sendMoneyForm.reset()
          this.beneficiaryForm.reset()
        }
      })
  }
}
