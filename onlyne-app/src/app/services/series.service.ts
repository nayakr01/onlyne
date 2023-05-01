import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Serie, SeriesResponse } from '../interfaces/series.interfaces';
import { SerieDetails } from '../interfaces/details.interfaces';

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
}