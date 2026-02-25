import { Injectable } from '@angular/core';
import { categoryModel } from '../../models/categoryModel';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class categoryService {
  // private apiUrl = 'http://localhost:5274/api/Category';

  private apiUrl = 'https://localhost:7063/api/Category';
  constructor(private http: HttpClient) { }

  private getAuthOptions() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAll(): Observable<categoryModel[]> {
    return this.http.get<categoryModel[]>(`${this.apiUrl}/getAllCategories`);
  }

  getById(id: number): Observable<categoryModel> {
    return this.http.get<categoryModel>(`${this.apiUrl}/getCategoryById/${id}`);
  }

  createCategory(category: categoryModel): Observable<categoryModel> {
    return this.http.post<categoryModel>(`${this.apiUrl}/createCategory`, category, this.getAuthOptions());
  }

  getAllCategories(): Observable<categoryModel[]> {
    return this.http.get<categoryModel[]>(`${this.apiUrl}/getAllCategories`);
  }

  updateCategoryById(id: number, category: categoryModel): Observable<categoryModel> {
    return this.http.put<categoryModel>(`${this.apiUrl}/updateCategoryById/${id}`, category, this.getAuthOptions());
  }
}