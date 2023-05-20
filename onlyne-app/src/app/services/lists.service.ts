import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../assets/js/config';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  urlServer = `http://${apiUrl}:3000`;

  constructor(private http: HttpClient) { }

  getAllLists(): Observable<any>  {
    return this.http.get(`${this.urlServer}/api/lists`);
  }

  getUserLists(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/users/${id}/lists`);
  }

  getUserFavouriteLists(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/users/${id}/favouriteLists`);
  }

  getListById(id: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/lists/${id}`);
  }

  createList(title: string, description: string, authorId: string, visibility: string): Observable<any> {
    return this.http.post(`${this.urlServer}/api/lists`, { title: title, description: description, author: authorId, visibility: visibility });
  }

  updateList(listId: string, title: string, description: string, visibility: string): Observable<any> {
    return this.http.put(`${this.urlServer}/api/lists/${listId}`, { title: title, description: description, visibility: visibility });
  }

  deleteList(listId: string): Observable<any> {
    return this.http.delete(`${this.urlServer}/api/lists/${listId}`);
  }

  deleteFavouriteList(userId: string, listId: string): Observable<any> {
    return this.http.delete(`${this.urlServer}/api/users/${userId}/favourites/${listId}`);
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

  checkSerieInList(listId: string, itemId: string) {
    return this.http.post(`${this.urlServer}/api/lists/${listId}/checkItem`, { serieId: itemId });
  }

  checkMovieInList(listId: string, itemId: string) {
    return this.http.post(`${this.urlServer}/api/lists/${listId}/checkItem`, { movieId: itemId });
  }

  removeMovieToList(clientId: string, listId: string, movieId: string) {
    return this.http.delete(`${this.urlServer}/api/users/${clientId}/lists/${listId}/items`, { 
      body: { movieId: movieId }
    });
  }
  
  removeSerieToList(clientId: string, listId: string, serieId: string) {
    return this.http.delete(`${this.urlServer}/api/users/${clientId}/lists/${listId}/items`, { 
      body: { serieId: serieId }
    });
  }

  addListToFavourites(clientId: string, listId: string) {
    return this.http.post(`${this.urlServer}/api/users/${clientId}/favourites`, { listId: listId });
  }

  getFollowersOfList(listId: string): Observable<any> {
    return this.http.get(`${this.urlServer}/api/lists/${listId}/followers/count`);
  }


}
