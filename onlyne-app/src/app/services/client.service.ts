import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  urlServer = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getClient(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.get(`${this.urlServer}/api/userprofile/${userId}`, { headers: headers });
  }
}
