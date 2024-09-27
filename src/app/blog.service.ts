import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from './Interfaces/Category';
import { environment } from '../app/Environments/Environment';
import { Observable } from 'rxjs';
import { BlogEntry } from './Interfaces/BlogEntry';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  
  getBlogEntries(): Observable<BlogEntry[]> {
    return this.http.get<BlogEntry[]>(`${this.apiUrl}/api/blogs`);
  }

  getEntryById(id: number) {
    return this.http.get(`${this.apiUrl}/api/blog/${id}`);
  }

  createEntry(entryData: any) {
    return this.http.post(`${this.apiUrl}/api/blog`, entryData);
  }

  updateEntry(id: number, entryData: any) {
    return this.http.put(`${this.apiUrl}/api/blog/${id}`, entryData);
  }

  deleteEntry(id: number) {
    return this.http.delete(`${this.apiUrl}/api/blog/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/api/categories`);
  }
  filterBlogsByCategory(blogs: BlogEntry[], category: string): BlogEntry[] {
    if (!category) return blogs;
    return blogs.filter(blog => blog.categoryNames.includes(category));
  }
}

