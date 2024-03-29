import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { CookieService } from 'ngx-cookie-service';
import { apiUrl } from '../../assets/js/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private token: any = '';
  private refreshToken: any = '';
  urlServer = `http://${apiUrl}:3000`;
  public client!: Client;

  public clientUpdated = new EventEmitter<Client>();

  constructor(private http: HttpClient) {
    this.getClientToken();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.urlServer +'/api/login', { email, password }).pipe(
      tap((response:any) => {
        this.token = response.token;
        this.refreshToken = response.refreshToken;
        this.setCookie('refreshToken', this.refreshToken);;
        localStorage.setItem('token', this.token);
        this.getClientToken();
      })
    );
  }


  updateClient(id: any, data:any): Observable<Client> {
    return this.http.put<Client>(this.urlServer + '/api/updateuser/' + id, { name: data.newName,
      email: data.newEmail}).pipe(
        tap((response:any) => {
          this.token = response.token;
          localStorage.removeItem('token');
          localStorage.setItem('token', this.token);
          
          this.clientUpdated.emit(response.client);
        })
      );
  }

  updatePasswordClient(id: any, data:any): Observable<Client> {
    return this.http.put<Client>(this.urlServer + '/api/updatepassworduser/' + id, { currentPassword: data.currentPassword,
      newPassword: data.newPassword});
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.urlServer}/api/forgotpassword`, { email: email });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(this.urlServer + '/api/register', { name, email, password });
  }

  getClientData(id: string): Observable<any> {
    return this.http.get(this.urlServer + '/api/userprofile/' + id)
  }

  getClientProfile() {
    if (this.client) {
      this.getClientData(this.client.id).subscribe({
        next: (data: any) => {
          this.client = {
            id: data.msg._id,
            name: data.msg.name,
            email: data.msg.email,
            profilePhoto: data.msg.profilePhoto,
            lists_created: data.msg.lists_created,
            lists_favourite: data.msg.lists_favourite,
            ratings: data.msg.ratings
          };
          this.clientUpdated.emit(this.client);
        },
        error: (error: any) => {
          console.log('Error al obtener las series:', error);
        }
      });   
    }
  }

  uploadPhoto(clientId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    formData.append('userId', clientId);
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    this.clientUpdated.emit(this.client);
    return this.http.post(this.urlServer + '/api/uploadphoto', formData, { headers }).pipe(
      tap((response:any) => {
        this.token = response.token;
        localStorage.removeItem('token');
        localStorage.setItem('token', this.token);
        this.clientUpdated.emit(response.user);
      })
    );
  }

  uploadDefaultPhoto(clientId: string, photo: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('userId', clientId);
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    this.clientUpdated.emit(this.client);
    return this.http.post(this.urlServer + '/api/defaultphoto', formData, { headers }).pipe(
      tap((response:any) => {
        this.token = response.token;
        localStorage.removeItem('token');
        localStorage.setItem('token', this.token);
        this.clientUpdated.emit(response.user);
      })
    );
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  refreshClientToken(): Observable<any> {
    const refreshToken = this.getCookie('refreshToken');
    return this.http.post(this.urlServer + "/api/refresh", { email: this.client.email, refreshToken: refreshToken });
  }

  private setCookie(name: string, value: string, expirationDays: number = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + "; " + expires + "; path=/";
  }

  private getCookie(name: string): string {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) == 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }

    return '';
  }

  getToken(): string {
    return this.token || localStorage.getItem('token');
  }

  getClientToken() {
    this.getToken();
    this.token = localStorage.getItem('token') || "";
    if(this.token != "") {
      const decodedToken: any = jwt_decode(this.token);
      this.client = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email,
        profilePhoto: decodedToken.profilePhoto
      };
    }
  }

  public getClient(): Client {
    this.getClientProfile();
    return this.client;
  }

  public setClient(client: Client) {
    this.client = client;
  }

}
