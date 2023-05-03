import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: any = '';
  urlServer = 'http://localhost:3000';
  public client!: Client;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.urlServer +'/api/login', { email, password }).pipe(
      tap((response:any) => {
        this.token = response.token;
        localStorage.setItem('token', this.token);
      })
    );
  }

  public clientUpdated = new EventEmitter<Client>();

  updateClient(id: any, data:any): Observable<Client> {
    return this.http.put<Client>(this.urlServer + '/api/updateuser/' + id, { name: data.newName,
      email: data.newEmail}).pipe(
        tap((response:any) => {
          this.token = response.token;
          localStorage.removeItem('token');
          localStorage.setItem('token', this.token);
          console.log(response);
          
          this.clientUpdated.emit(response.client);
        })
      );
  }

  updatePasswordClient(id: any, data:any): Observable<Client> {
    return this.http.put<Client>(this.urlServer + '/api/updatepassworduser/' + id, { currentPassword: data.currentPassword,
      newPassword: data.newPassword});
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(this.urlServer + '/api/register', { name, email, password });
  }

  getToken(): string {
    return this.token || localStorage.getItem('token');
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  getClientToken() {
    this.token = localStorage.getItem('token') || "";
    if(this.token != "") {
      const decodedToken: any = jwt_decode(this.token);
      this.client = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email
      };
      console.log(this.client);
    }
  }

  public getClient(): Client {
    this.getClientToken();
    return this.client;
  }

  public setClient(client: Client) {
    this.client = client;
  }

}
