import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { prizeModel } from '../../models/prizeModel';

@Injectable({
  providedIn: 'root',
})
export class prizeService {
  // private apiUrl = 'http://localhost:5274/api/prize';
  private apiUrl = 'https://localhost:7063/api/prize';
  constructor(private http: HttpClient) { }

  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) return new HttpHeaders();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  getPrizesByCategory(categoryId: number): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(
      `${this.apiUrl}/getPrizesByCategory/${categoryId}`
    )}

  getAll(): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(`${this.apiUrl}/getAllPrizes`);
  }

  getById(id: number): Observable<prizeModel> {
    return this.http.get<prizeModel>(`${this.apiUrl}/getPrizeById/${id}`);
  }

  searchByName(name: string): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(`${this.apiUrl}/searchPrizesByName/${name}`);
  }

  searchByDonorName(donorName: string): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(`${this.apiUrl}/searchPrizesByDonorName/${donorName}`);
  }

  searchByCount(count: number): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(`${this.apiUrl}/searchPrizesByCount/${count}`);
  }

  getWithDonors(): Observable<prizeModel[]> {
    return this.http.get<prizeModel[]>(`${this.apiUrl}/getPrizesWithDonors`);
  }

  getTicketByPrizeName(prizeName: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/getTicketByPrizeName/${prizeName}`);
  }

  create(prize: prizeModel): Observable<prizeModel> {
    const headers = this.buildAuthHeaders();
    return this.http.post<prizeModel>(`${this.apiUrl}/createNewPrize`, prize, { headers });
  }

  updateById(id: number, prize: prizeModel): Observable<prizeModel> {
    const headers = this.buildAuthHeaders();
    return this.http.put<prizeModel>(`${this.apiUrl}/updatePrizeById/${id}`, prize, { headers });
  }

  deleteById(id: number): Observable<void> {
    const headers = this.buildAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/deletePrizeById/${id}`, { headers });
  }
}