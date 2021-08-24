import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService,
              private router: Router) { }
  public login(data: {}) {
    return this.apiService.post('login', data)
  }
  public getToken(): string {
    return <string>localStorage.getItem('token');
  }
  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  public isAuthenticated(): boolean {
    const token = !!this.getToken();
    if(!token) {
      this.router.navigateByUrl('/')
    }
    return token;
  }
}
