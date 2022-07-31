import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup
  constructor(
    private formBuild: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private shared: SharedService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuild.group({
      email: [''],
      password: ['']
    })
  }
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }

  login() {
    //console.log(this.loginForm.value);
    this.http.post<any>("http://127.0.0.1:3000/validateUser", this.loginForm.value, this.httpOptions)
      .subscribe({
        next: (nx) => {
          //console.log(nx)
          setTimeout(() => {
            alert("Login Succesfull!!");
            this.loginForm.reset();
            this.shared.setName(nx.usrname)
            this.shared.setBalance(nx.balance)
            this.shared.setAccnt(nx.accnt_num)
            this.router.navigate(['/dashboard'])
          }, 3000)
          // Send usrname and account_num to dashboard
        }
        , error: (err) => {
          //console.log(err.error.msg)
          alert(err.error.msg)
          this.router.navigate(['/login'])
        }
      })
  }
}
