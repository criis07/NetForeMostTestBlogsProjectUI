import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from './interfaces/Category';
import { environment } from '../app/Environments/Environment';
import { Observable } from 'rxjs';
import { BlogEntry } from './interfaces/BlogEntry';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  
  getBlogEntries(): Observable<BlogEntry[]> {
    return this.http.get<BlogEntry[]>(`${this.apiUrl}/api/categories`);
  }

  getEntryById(id: number) {
    return this.http.get(`/api/blog-entries/${id}`);
  }

  createEntry(entryData: any) {
    return this.http.post('/api/blog-entries', entryData);
  }

  updateEntry(id: number, entryData: any) {
    return this.http.put(`/api/blog-entries/${id}`, entryData);
  }

  deleteEntry(id: number) {
    return this.http.delete(`/api/blog-entries/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/api/categories`);
  }
  
}

