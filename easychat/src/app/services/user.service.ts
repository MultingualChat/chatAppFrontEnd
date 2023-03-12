import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseApi = 'https://easychat-8wvu.onrender.com/user';

  constructor(private httpClient: HttpClient) {}

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  updateUser(data: any): Observable<User> {
    return this.httpClient.patch<User>(`${this.baseApi}/update`, {
      nickname: data.nickname,
      avatar: data.avatar,
      language: data.language,
    });
  }

  signUp(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.baseApi}/create`, user);
  }
}
