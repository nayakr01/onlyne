import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { Movie } from '../interfaces/movies.interfaces';
import { Serie } from '../interfaces/series.interfaces';
import { Genre } from '../interfaces/genres.interfaces';
import { ActivatedRoute, Router } from '@angular/router';


interface MoviesWithGenre {
  id: number;
  title: string;
  genre: string;
  path: string;
}

interface SeriesWithGenre {
  id: number;
  title: string;
  genre: string;
  path: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  movies: Movie[] = [];

  series: Serie[] = [];

  genres: Genre[] = [];

  moviesWithGenre: MoviesWithGenre[] = [];

  seriesWithGenre: SeriesWithGenre[] = [];

  text: string = '';

  constructor(private activatedRoute: ActivatedRoute, private moviesService: MoviesService, private seriesService: SeriesService, private router: Router) { }

  ngOnInit() {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getSearch();
  }

  getSearch() {
    this.activatedRoute.params.subscribe(params => {
      this.text = params['text'];
      this.moviesService.search(this.text).subscribe(movie => {
        this.moviesWithGenre = movie.map(m => {
          return {
            id: m.id,
            title: m.title,
            genre: '',
            path: m.poster_path
          };
        });
      });

      this.moviesService.getGenres().subscribe(data => {
        const generos: Genre[] = data['genres'];
  
        this.moviesService.search(this.text).subscribe(movie => {
          this.moviesWithGenre = movie.map(m => {
            const genre = generos.find(g => g.id === m.genre_ids[0]);
            return {
              id: m.id,
              title: m.title,
              genre: genre?.name || 'Sin género',
              path: m.poster_path
            };
          });
        });
      }, error => {
        console.log('Error al obtener los géneros para las películas:', error);
      });
  
      this.seriesService.search(this.text).subscribe(serie => {
        this.seriesWithGenre = serie.map(m => {
          return {
            id: m.id,
            title: m.original_name,
            genre: '',
            path: m.poster_path
          };
        });
      });
  
      this.seriesService.getGenres().subscribe(data => {
        const generos: Genre[] = data['genres'];
  
        this.seriesService.search(this.text).subscribe(serie => {
          this.seriesWithGenre = serie.map(m => {
            const genre = generos.find(g => g.id === m.genre_ids[0]);
            return {
              id: m.id,
              title: m.original_name,
              genre: genre?.name || 'Sin género',
              path: m.poster_path
            };
          });
        });
      }, error => {
        console.log('Error al obtener los géneros para las series:', error);
      });
    })
  }

  getDetailsMovie(movie: MoviesWithGenre) {
    this.router.navigate(['/details-movie', movie.id]);
  }

  getDetailsSerie(serie: SeriesWithGenre) {
    console.log(serie);
    this.router.navigate(['/details-serie', serie.id]);
  }
}