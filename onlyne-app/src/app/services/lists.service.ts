import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  urlServer = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUserLists(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/users/${id}/lists`);
  }

  createList(title: string, description: string, authorId: string): Observable<any> {
    return this.http.post(`${this.urlServer}/api/lists`, { title: title, description: description, author: authorId });
  }

  deleteList(listId: string): Observable<any> {
    return this.http.delete(`${this.urlServer}/api/lists/${listId}`);
  }

}
