import { Injectable } from '@angular/core';
import { environment } from '../app/Environments/Environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/user/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token) {
          // Almacenar el token en localStorage
          localStorage.setItem('authToken', response.token);
          console.log('redireccionando');
          this.router.navigate(['/home']);
        }
      })
    );
  }

  signUp(user: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/register`, user);
  }
     // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;  // Devuelve true si hay un token guardado, de lo contrario false
  }
  updateUser(id: number, entryData: any) {
    return this.http.put(`${this.apiUrl}/api/user/${id}`, entryData);
  }
  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/api/user/${id}`);
  }
  deleteUser(id: number) {
    return this.http.delete(`${this.apiUrl}/api/user/${id}`);
  }
}
