import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../interfaces/category';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseURL = `${environment.hostAndPort}/api/v1/category`;

  constructor(
    private http: HttpClient
  ) { }

  public addCategory(category: Category): Promise<Category> {
    const obj = {
      data: {
        name: category.name
      }
    };
    return this.http.post<Category>(this.baseURL, obj).toPromise();
  }

  public getCategories(): Promise<Category> {
    return this.http.get<Category>(this.baseURL).toPromise();
  }

  public deleteCategory(category: Category): Promise<Category> {
    const obj = {
      data: category
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: obj,
    };
    return this.http.delete<Category>(this.baseURL, options).toPromise();
  }
}
