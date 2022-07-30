import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private router: Router
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
    console.log(this.loginForm.value);
    this.http.post<any>("http://127.0.0.1:3000/validateUser", this.loginForm.value, this.httpOptions)
      .subscribe({
        next: () => {
          this.loginForm.reset();
          this.router.navigate(['/dashboard'])
          alert("Login Succesfull!!");
        }
        , error: (err) => {
          //console.log(err.error.msg)
          alert(err.error.msg)
          this.router.navigate(['/login'])
        }
      })
  }
}
