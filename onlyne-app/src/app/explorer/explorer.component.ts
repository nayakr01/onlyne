import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Serie } from '../interfaces/series.interfaces';
import { Genre } from '../interfaces/genres.interfaces';

interface MoviesWithGenre {
  title: string;
  genre: string;
  path: string;
}

interface SeriesWithGenre {
  title: string;
  genre: string;
  path: string;
}

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent {
  movies: Movie[] = [];

  series: Serie[] = [];

  genres: Genre[] = [];

  moviesWithGenre: MoviesWithGenre[] = [];

  seriesWithGenre: SeriesWithGenre[] = [];

  constructor(private moviesService: MoviesService, private seriesService: SeriesService) { }

  ngOnInit() {
    let trend = document.getElementById('explorer');
    document.querySelectorAll('.nav-link').forEach(function (elem){
        elem.classList.remove('nav-active');
    });
    trend?.classList.add('nav-active');
    
    for (let index = 1; index <= 5; index++) {
      this.getMovies(index);
      this.getSeries(index);
    }
  }

  getMovies(page: number) {
    this.moviesService.getMovies(page).subscribe({
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
                title: movie.title,
                genre: genre.name,
                path: movie.poster_path
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

  getSeries(page: number) {
    this.seriesService.getSeries(page).subscribe({
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
                title: serie.original_name,
                genre: genre.name,
                path: serie.poster_path
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
}