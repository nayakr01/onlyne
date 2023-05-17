import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  urlServer = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllLists(): Observable<any>  {
    return this.http.get(`${this.urlServer}/api/lists`);
  }

  getUserLists(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/users/${id}/lists`);
  }

  getUserFavoriteLists(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/users/${id}/favoriteLists`);
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

  deleteFavoriteList(userId: string, listId: string): Observable<any> {
    return this.http.delete(`${this.urlServer}/api/users/${userId}/favorites/${listId}`);
  }

  uploadListPhoto(listId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('listPhoto', file);
    formData.append('listId', listId);
    return this.http.post(this.urlServer + '/api/uploadListPhoto', formData);
  }

  addMovieToList(clientId: string, listId: string, movieId: string) {
    return this.http.post(`${this.urlServer}/api/users/${clientId}/lists/${listId}/items`, { movieId: movieId });
  }

  addSerieToList(clientId: string, listId: string, serieId: string) {
    return this.http.post(`${this.urlServer}/api/users/${clientId}/lists/${listId}/items`, { serieId: serieId });
  }

  addListToFavourites(clientId: string, listId: string) {
    return this.http.post(`${this.urlServer}/api/users/${clientId}/favorites`, { listId: listId });
  }

}
