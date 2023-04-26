import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Genre } from '../interfaces/genres.interfaces';

interface MoviesWithGenre {
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


  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    let movies = document.getElementById('movies');
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    movies?.classList.add('nav-active');

    for (let index = 1; index <= 5; index++) {
      this.getMovies(index);
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
}