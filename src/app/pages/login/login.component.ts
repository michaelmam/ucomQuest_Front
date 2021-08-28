import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.auth.getToken() && this.router.navigateByUrl('/admin')
  }
  onSubmit() {
    this.auth.login(this.form.value).subscribe(data => {
      if (data?.token) {
        this.auth.setToken(data.token)
        this.router.navigateByUrl('/admin')
      }
    })
  }
}
