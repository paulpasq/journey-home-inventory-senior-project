import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/* 
Login page, users will be redirected here if they have not loggen in yet
This page stores a cookie if successful 
*/

export class LoginComponent implements OnInit {
  showErrorMessage: Boolean;
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.showErrorMessage = false
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  submitForm() {
    const params = new HttpParams({
      fromObject: {
        Email: this.loginForm.controls.userName.value,
        Password: this.loginForm.controls.password.value
      }
    })

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      observe: 'response' as 'response'
    }
    this.http.post('/api/user/login', params, httpOptions)
      .subscribe(
        resp => this.registerLogin(resp),
        error => this.handleError(),
        () => this.onComplete()
      )
  }

  registerLogin(response) {
    this.loginService.loginSession(response)
  }

  onComplete() {
    this.router.navigate(['/inventory', 'main'])
  }

  handleError() {
    this.showErrorMessage = true
  }

}