import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signupForm !: FormGroup;
  constructor(private formBuild: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuild.group({
      fullName: [''],
      email: [''],
      password: ['']
    })
  }
  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }
  signUp() {
    console.log(this.signupForm.value);
    this.http.post<any>("http://127.0.0.1:3000/addUser", this.signupForm.value, this.httpOptions)
      .subscribe({
        next: () => {
          this.signupForm.reset();
          this.router.navigate(['/login'])
          alert("SignUp Succesfull!!");
        }
        , error: (err) => {
          //console.log(err.error.msg)
          alert(err.error.msg)
          this.router.navigate(['/signup'])
        }
      })
  }
}
