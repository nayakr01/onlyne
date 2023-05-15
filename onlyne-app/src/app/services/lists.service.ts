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

  getListById(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/lists/${id}`);
  }

  createList(title: string, description: string, authorId: string): Observable<any> {
    return this.http.post(`${this.urlServer}/api/lists`, { title: title, description: description, author: authorId });
  }

  updateList(listId: string, title: string, description: string): Observable<any> {
    return this.http.put(`${this.urlServer}/api/lists/${listId}`, { title: title, description: description });
  }

  deleteList(listId: string): Observable<any> {
    return this.http.delete(`${this.urlServer}/api/lists/${listId}`);
  }

  addMovieToList(clientId: string, listId: string, movieId: string) {
    return this.http.post(`${this.urlServer}/api/users/${clientId}/lists/${listId}/items`, { itemId: movieId });
  }

}
