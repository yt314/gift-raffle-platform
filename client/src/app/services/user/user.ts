import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../../models/user/userModel';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private apiUrl = 'http://localhost:5274/api/Users';

  private apiUrl = 'https://localhost:7063/api/Users';
  constructor(private http: HttpClient) { }

  private getAuthOptions(): HttpHeaders {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('access_token');

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/`, { headers: this.getAuthOptions() });
  }

  getById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthOptions() });
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/`, user, { headers: this.getAuthOptions() });
  }

  updateUserById(id: number, user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${id}`, user, { headers: this.getAuthOptions() });
  }

  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthOptions() });
  }
}
