import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Movie, MoviesResponse } from '../interfaces/movies.interfaces';
import { Genre, GenreResponse } from '../interfaces/genres.interfaces';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private serverURL:string = 'https://api.themoviedb.org/3';
  
  constructor(private http: HttpClient) { }

  get params() {
    return {
      api_key : '727678ffa6c82ebcb8ebec5f547d0db9',
      languague: 'es-ES',
    }
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<MoviesResponse>(`${this.serverURL}/movie/popular?`,{params: this.params}).pipe(
      map((res) => res.results)
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.serverURL}/genre/movie/list?`,{params: this.params}).pipe(
      map((res) => res)
    );
  }
}