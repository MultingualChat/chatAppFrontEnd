import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Session } from '../models/session';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApi = 'https://easychat-8wvu.onrender.com/auth';

  private _logOut$ = new BehaviorSubject<boolean>(false);

  public loggedOut$ = this._logOut$.asObservable();

  constructor(private httpClient: HttpClient) {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return false;
    }
    return true;
  }

  login(email: string, password: string): Observable<Session> {
    return this.httpClient
      .post<Session>(`${this.baseApi}/login`, {
        email: email,
        password: password,
      })
      .pipe(
        tap((session) => {
          localStorage.setItem('token', session.access_token);
          this._logOut$.next(false);
        })
      );
  }

  logout(): Observable<Session> {
    localStorage.setItem('token', '');
    this._logOut$.next(true);

    return this.httpClient.get<Session>(`${this.baseApi}/logout`);
  }
}
