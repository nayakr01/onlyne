import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Serie } from '../interfaces/series.interfaces';
import { Genre } from '../interfaces/genres.interfaces';
import { Router } from '@angular/router';

interface MoviesWithGenre {
  id: number;
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

  constructor(private moviesService: MoviesService, private seriesService: SeriesService, private router: Router) { }

  ngOnInit() {
    let explorer = document.getElementById('explorer');
    document.querySelectorAll('.nav-link').forEach(function (elem){
        elem.classList.remove('nav-active');
    });
    explorer?.classList.add('nav-active');
    
    for (let index = 1; index <= 5; index++) {
      this.getMovies(index);
      this.getSeries(index);
    }
  }

  getMovies(page: number) {
    this.moviesService.getMovies(page).subscribe({
      next: (data: any) => {
        console.log(data);
        const movies: Movie[] = data;
        this.moviesService.getGenres().subscribe(data => {
          const generos: Genre[] = data['genres'];

          for (let movie of movies) {
            const genreId = movie.genre_ids[0];
            const genre = generos.find(g => g.id === genreId);
            if (genre) {
              const moviesWithGenres: MoviesWithGenre = {
                id: movie.id,
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
        const series: Serie[] = data;
        this.seriesService.getGenres().subscribe(data => {
          const generos: Genre[] = data['genres'];

          for (let serie of series) {
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

  getDetailsMovie(movie: MoviesWithGenre) {
    this.router.navigate(['/details', movie.id]);
  }
}