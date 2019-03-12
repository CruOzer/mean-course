import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../models/AuthData';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {}

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
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:5000/api/user/login',
        authData
      )
      .subscribe(response => {
        this.token = response.token;
        if (this.token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTime(expiresInDuration);
          this.setAuthentication(true);
          this.userId = response.userId;
          // Save Data
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }
  private setAuthTime(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private setAuthentication(auth: boolean) {
    this.isAuthenticated = auth;
    this.authStatusListener.next(auth);
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.setAuthentication(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getUserId(): string {
    return this.userId;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  autoAuthUser() {
    const info: { token: string; expirationDate: Date, userId: string } = this.getAuthData();
    if (!info) {
      return;
    }
    const now = new Date();
    const expiresIn = info.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = info.token;
      this.userId = info.userId;
      this.setAuthTime(expiresIn / 1000);
      this.setAuthentication(true);
    }
  }

  private getAuthData(): { token: string; expirationDate: Date, userId: string} {
    const token = localStorage.getItem('tokenMeanCourse');
    const userId = localStorage.getItem('userMeanCourse');
    const expirationDate = localStorage.getItem('expirationMeanCourse');
    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate)
    };
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('tokenMeanCourse', token);
    localStorage.setItem('expirationMeanCourse', expirationDate.toISOString());
    localStorage.setItem('userMeanCourse', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('tokenMeanCourse');
    localStorage.removeItem('expirationMeanCourse');
    localStorage.removeItem('userMeanCourse');
  }
}
