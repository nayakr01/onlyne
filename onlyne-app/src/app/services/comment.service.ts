import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../assets/js/config';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  urlServer = `http://${apiUrl}:3000`;

  constructor(private http: HttpClient) { }

  getMovieComment(movieId: string) {
    return this.http.get(`${this.urlServer}/api/movies/${movieId}/comment`);
  }

  getSerieComment(serieId: string) {
    return this.http.get(`${this.urlServer}/api/series/${serieId}/comment`);
  }

  addCommentToMovie(userId:string, movieId: string, comment: string) {
    return this.http.post(`${this.urlServer}/api/movies/${movieId}/comment`, { comment: comment, userId: userId });
  }

  addCommentToSerie(userId:string, serieId: string, comment: string) {
    return this.http.post(`${this.urlServer}/api/series/${serieId}/comment`, { comment: comment, userId: userId });
  }

}
