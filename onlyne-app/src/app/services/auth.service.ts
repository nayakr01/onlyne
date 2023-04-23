import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: any = '';
  urlServer = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.urlServer +'/api/login', { email, password }).pipe(
      tap((response:any) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post('/api/register', { name, email, password });
  }

  getToken(): string {
    return this.token || localStorage.getItem('token');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }


}
