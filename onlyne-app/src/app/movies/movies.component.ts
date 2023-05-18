import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Genre } from '../interfaces/genres.interfaces';
import { Router } from '@angular/router';

interface MoviesWithGenre {
  id: number,
  title: string;
  genre: string;
  path: string;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})

export class MoviesComponent {
  movies: Movie[] = [];

  genres: Genre[] = [];

  moviesWithGenre: MoviesWithGenre[] = [];

  selectedGenre: Genre | null = null;


  constructor(private moviesService: MoviesService, private router: Router) { }

  ngOnInit() {
    let movies = document.getElementById('movies');
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    movies?.classList.add('nav-active');

    for (let index = 1; index <= 5; index++) {
      this.getMovies(index);
    }

    this.getGenresForMovies();
  }

  getGenresForMovies() {
    this.moviesService.getGenres().subscribe(
      (data: any) => {
        this.genres = this.genres.concat(data.genres);
      },
      error => {
        console.log('Error al obtener los géneros de películas:', error);
      }
    );
  }

  getMovies(page: number) {
    this.moviesService.getMovies(page).subscribe({
      next: (data: any) => {
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
                genre: genre.name || 'Sin género',
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

  selectGenre(genre: Genre) {
    if (this.selectedGenre === genre) {
      this.selectedGenre = null;
      this.moviesWithGenre = [];
      for (let index = 1; index <= 5; index++) {
        this.getMovies(index);
      }
    } else {
      this.selectedGenre = genre;
      this.moviesWithGenre = [];
      this.getMoviesWithGenre(genre);
    }
  }

  getMoviesWithGenre(genre: Genre) {
    const genreId = genre.id;
    this.moviesService.getMoviesByGenre(genreId).subscribe(
      (data: any) => {
        const movies: Movie[] = data;
        for (let movie of movies) {
          const moviesWithGenres: MoviesWithGenre = {
            id: movie.id,
            title: movie.title,
            genre: genre.name || 'Sin género',
            path: movie.poster_path
          };
          this.moviesWithGenre.push(moviesWithGenres);
        }
      },
      error => {
        console.log('Error al obtener las películas del género:', error);
      }
    );
  }

  getDetailsMovie(movie: MoviesWithGenre) {
    this.router.navigate(['/details-movie', movie.id]);
  }
}
