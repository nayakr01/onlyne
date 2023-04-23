import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Genre } from '../interfaces/genres.interfaces';

interface MoviesWithGenre {
  title: string;
  genre: string;
  path: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  movies: Movie[] = [];

  genres: Genre[] = [];

  moviesWithGenre: MoviesWithGenre[] = [];

  constructor(private moviesService: MoviesService) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies() {
    this.moviesService.getMovies().subscribe({
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
            } else {
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