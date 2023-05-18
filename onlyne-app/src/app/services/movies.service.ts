import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Movie, MoviesResponse } from '../interfaces/movies.interfaces';
import { MovieDetails } from '../interfaces/details.interfaces';
import { Cast, CreditsMovies } from '../interfaces/credits.interfaces';
import { Streaming } from '../interfaces/streaming.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private serverURL: string = 'https://api.themoviedb.org/3';
  private pageMovies = 1;

  constructor(private http: HttpClient) { }

  get params() {
    return {
      api_key: '727678ffa6c82ebcb8ebec5f547d0db9',
      language: 'es-ES',
      page: this.pageMovies.toString(),
    }
  }

  getMovies(page: number): Observable<Movie[]> {
    this.pageMovies = page;
    return this.http.get<MoviesResponse>(`${this.serverURL}/movie/upcoming?`, { params: this.params }).pipe(
      map((res) => res.results)
    );
  }

  getPopularMovies(page: number): Observable<Movie[]> {
    this.pageMovies = page;
    return this.http.get<MoviesResponse>(`${this.serverURL}/movie/popular?`, { params: this.params }).pipe(
      map((res) => res.results)
    );
  }

  getRatingMovies(page: number): Observable<Movie[]> {
    this.pageMovies = page;
    return this.http.get<MoviesResponse>(`${this.serverURL}/movie/top_rated?`, { params: this.params }).pipe(
      map((res) => res.results)
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.serverURL}/genre/movie/list?`, { params: this.params }).pipe(
      map((res) => res)
    );
  }

  getDetails(id: string) {
    return this.http.get<MovieDetails>(`${this.serverURL}/movie/${id}`, { params: this.params }).pipe(
    );
  }

  getTrailer(id: string) {
    return this.http.get(`${this.serverURL}/movie/${id}/videos?`, { params: this.params }).pipe(
      map((response: any) => {
        const results = response.results;
        const trailer = results.find((video: any) => video.type === 'Trailer');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
      })
    );
  }

  getActor(id: string): Observable<Cast[]> {
    return this.http.get<CreditsMovies>(`${this.serverURL}/movie/${id}/credits?`, { params: this.params }).pipe(
      map((res) => res.cast)
    );
  }

  getStreaming(id: string): Observable<Streaming> {
    return this.http.get<Streaming>(`${this.serverURL}/movie/${id}/watch/providers`, { params: this.params });
  }

  search(text: string): Observable<Movie[]> {
    const params = { ...this.params, page: 1, query: text };
    return this.http.get<MoviesResponse>(`${this.serverURL}/search/movie`, {params}).pipe(map((res) => res.results));
  }

  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.http.get<MoviesResponse>(`${this.serverURL}/discover/movie?`, { params: { ...this.params, with_genres: genreId.toString() } }).pipe(
      map((res) => res.results)
    );
  }
}