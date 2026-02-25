import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { donorModel } from '../../models/donorModel';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private apiUrl = 'http://localhost:5274/api/Donor';

  private apiUrl = 'https://localhost:7063/api/Donor';
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

  getAll(): Observable<donorModel[]> {
    return this.http.get<donorModel[]>(`${this.apiUrl}/`, { headers: this.getAuthOptions() });
  }

  getById(id: number): Observable<donorModel> {
    return this.http.get<donorModel>(`${this.apiUrl}/${id}`, { headers: this.getAuthOptions() });
  }

  searchDonorByFullName(fullName: string): Observable<donorModel[]> {
    return this.http.get<donorModel[]>(`${this.apiUrl}/searchDonorByFullName?fullName=${encodeURIComponent(fullName)}`, { headers: this.getAuthOptions() });
  }

  createDonor(donor: donorModel): Observable<donorModel> {
    return this.http.post<donorModel>(`${this.apiUrl}`, donor, { headers: this.getAuthOptions() });
  }

  updateDonorById(id: number, donor: donorModel): Observable<donorModel> {
    return this.http.put<donorModel>(`${this.apiUrl}/${id}`, donor, { headers: this.getAuthOptions() });
  }
  deleteDonorById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthOptions() });
  }
}
