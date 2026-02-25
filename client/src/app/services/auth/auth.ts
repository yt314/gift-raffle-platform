import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCreateModel } from '../../models/user/userCreateModel';
import { UserModel } from '../../models/user/userModel';
import { LoginModel } from '../../models/user/loginModel';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'https://localhost:7063/api/Auth';

  private tokenSignal = signal<string | null>(
    localStorage.getItem('token')
  );

  private userSignal = signal<UserModel | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  constructor(private http: HttpClient) { }

  register(user: UserCreateModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(data: LoginModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  setLogin(token: string, user: UserModel) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  logout() {
    localStorage.clear();
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  get getToken(): string | null {
    return this.tokenSignal();
  }

  get getUser(): UserModel | null {
    return this.userSignal();
  }

  getUserSignal = this.userSignal;

  isLoggedIn(): boolean {
    return !!this.tokenSignal();
  }

  getRole(): 'user' | 'manager' | null {
    return this.userSignal()?.role ?? null;
  }

  isManager(): boolean {
    return this.getRole() === 'manager';
  }
}
