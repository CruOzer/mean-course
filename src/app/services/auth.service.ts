import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/AuthData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  constructor(private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http
      .post('http://localhost:5000/api/user/signup', authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    };
    this.http
      .post<{ token: string }>('http://localhost:5000/api/user/login', authData)
      .subscribe(response => {
        this.token = response.token;
      });
  }

  getToken(): string {
    return this.token;
  }
}
