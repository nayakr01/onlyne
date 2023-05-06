import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Serie } from '../interfaces/series.interfaces';
import { Genre } from '../interfaces/genres.interfaces';
import { Router } from '@angular/router';

interface MoviesWithGenre {
  id: number,
  title: string;
  genre: string;
  path: string;
  type: string;
}

interface SeriesWithGenre {
  id: number,
  title: string;
  genre: string;
  path: string;
  type: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  movies: Movie[] = [];

  series: Serie[] = [];

  genres: Genre[] = [];

  moviesWithGenre: MoviesWithGenre[] = [];

  seriesWithGenre: SeriesWithGenre[] = [];

  constructor(private moviesService: MoviesService, private seriesService: SeriesService, private router: Router) { }
  
  ngOnInit() {
    let home = document.getElementById('home');
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    home?.classList.add('nav-active');
    this.getRatingMovies(1);
    this.getRatingSeries(1);
    this.loadScript();
  }

  loadScript() {
    const script = document.createElement('script');
    script.src = '../assets/js/main.js';
    document.body.appendChild(script);
  }
  
  getRatingMovies(page: number) {
    this.moviesService.getRatingMovies(page).subscribe({
      next: (data: any) => {
        console.log(data);
        this.movies = data;
        this.moviesService.getGenres().subscribe(data => {
          const generos: Genre[] = data['genres'];

          for (let movie of this.movies) {
            const genreId = movie.genre_ids[0];
            const genre = generos.find(g => g.id === genreId);
            if (genre) {
              const moviesWithGenres: MoviesWithGenre = {
                id: movie.id,
                title: movie.title,
                genre: genre.name || 'Sin género',
                path: movie.poster_path,
                type: "0",
              };
              this.moviesWithGenre?.push(moviesWithGenres);
            }
          }
        }, error => {
          console.log('Error al obtener los géneros:', error);
        });
      },
      error: error => {
        console.log('Error al obtener las películas:', error);
      }
    });
  }

  getRatingSeries(page: number) {
    this.seriesService.getRatingSeries(page).subscribe({
      next: (data: any) => {
        console.log(data);
        this.series = data;
        this.seriesService.getGenres().subscribe(data => {
          const generos: Genre[] = data['genres'];

          for (let serie of this.series) {
            const genreId = serie.genre_ids[0];
            const genre = generos.find(g => g.id === genreId);
            if (genre) {
              const seriesWithGenres: SeriesWithGenre = {
                id: serie.id,
                title: serie.original_name,
                genre: genre.name || 'Sin género',
                path: serie.poster_path,
                type: "1",
              };
              this.seriesWithGenre?.push(seriesWithGenres);
            }
          }
        }, error => {
          console.log('Error al obtener los géneros:', error);
        });
      },
      error: error => {
        console.log('Error al obtener las series:', error);
      }
    });
  }

  getDetailsMovie(movie: MoviesWithGenre) {
    this.router.navigate(['/details-movie', movie.id]);
  }

  getDetailsSerie(serie: SeriesWithGenre) {
    console.log(serie);
    this.router.navigate(['/details-serie', serie.id]);
  }
}