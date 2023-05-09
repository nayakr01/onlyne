import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  urlServer = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getLists(id: string) {
    return this.http.get(`${this.urlServer}/api/users/${id}/lists`);
  }

}
