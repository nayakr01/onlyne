import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Serie, SeriesResponse } from '../interfaces/series.interfaces';
import { SerieDetails } from '../interfaces/details.interfaces';
import { Cast, CreditsSeries } from '../interfaces/credits.interfaces';
import { Streaming } from '../interfaces/streaming.interface';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private serverURL:string = 'https://api.themoviedb.org/3';
  private pageSeries = 1;
  
  constructor(private http: HttpClient) { }

  get params() {
    return {
      api_key : '727678ffa6c82ebcb8ebec5f547d0db9',
      language: 'es-ES',
      page: this.pageSeries.toString(),
    }
  }

  getSeries(page:number): Observable<Serie[]> {
    this.pageSeries = page;
    return this.http.get<SeriesResponse>(`${this.serverURL}/tv/airing_today?`,{params: this.params}).pipe(
      map((res) => res.results)
    );
  }

  getPopularSeries(page:number): Observable<Serie[]> {
    this.pageSeries = page;
    return this.http.get<SeriesResponse>(`${this.serverURL}/tv/popular?`,{params: this.params}).pipe(
      map((res) => res.results)
    );
  }

  getRatingSeries(page:number): Observable<Serie[]> {
    this.pageSeries = page;
    return this.http.get<SeriesResponse>(`${this.serverURL}/tv/top_rated?`,{params: this.params}).pipe(
      map((res) => res.results)
    );
  }

  getGenres(): Observable<any> {
    return this.http.get(`${this.serverURL}/genre/tv/list?`,{params: this.params}).pipe(
      map((res) => res)
    );
  }

  getDetails(id: string) {
    return this.http.get<SerieDetails>(`${this.serverURL}/tv/${id}`, { params: this.params }).pipe(
    );
  }

  getTrailer(id: string) {
    return this.http.get(`${this.serverURL}/tv/${id}/videos?`, { params: this.params }).pipe(
      map((response: any) => {
        const results = response.results;
        const trailer = results.find((video: any) => video.type === 'Trailer');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
      })
    );
  }

  getActor(id: string):Observable<Cast[]> {
    return this.http.get<CreditsSeries>(`${this.serverURL}/tv/${id}/credits?`, { params: this.params }).pipe(
      map((res) => res.cast)
    );
  }

  getStreaming(id: string): Observable<Streaming> {
    return this.http.get<Streaming>(`${this.serverURL}/tv/${id}/watch/providers`, { params: this.params });
  }
  
  search(text: string): Observable<Serie[]> {
    const params = { ...this.params, page: 1, query: text };
    return this.http.get<SeriesResponse>(`${this.serverURL}/search/tv`, {params}).pipe(map((res) => res.results));
  }
}