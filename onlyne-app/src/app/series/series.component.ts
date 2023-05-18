import { Component } from '@angular/core';
import { SeriesService } from '../services/series.service';
import { Serie } from '../interfaces/series.interfaces';
import { Genre } from '../interfaces/genres.interfaces';
import { Router } from '@angular/router';


interface SeriesWithGenre {
  id: number;
  title: string;
  genre: string;
  path: string;
}

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent {

  series: Serie[] = [];

  genres: Genre[] = [];

  seriesWithGenre: SeriesWithGenre[] = [];

  selectedGenre: Genre | null = null;

  constructor(private seriesService: SeriesService,  private router: Router) { }

  ngOnInit() {
    let series = document.getElementById('series');
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    series?.classList.add('nav-active');

    for (let index = 1; index <= 5; index++) {
      this.getSeries(index);
    }
    this.getGenresForSeries();
  }

  getGenresForSeries() {
    this.seriesService.getGenres().subscribe(
      (data: any) => {
        this.genres = this.genres.concat(data.genres);
      },
      error => {
        console.log('Error al obtener los géneros de películas:', error);
      }
    );
  }

  getSeries(page: number) {
    this.seriesService.getSeries(page).subscribe({
      next: (data: any) => {
        const series: Serie[] = data;
        this.seriesService.getGenres().subscribe(data => {
          const generos: Genre[] = data['genres'];

          for (let serie of series) {
            const genreId = serie.genre_ids[0];
            const genre = generos.find(g => g.id === genreId);
            if (genre) {
              const seriesWithGenres: SeriesWithGenre = {
                id: serie.id,
                title: serie.original_name,
                genre: genre.name || 'Sin género',
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

  selectGenre(genre: Genre) {
    if (this.selectedGenre === genre) {
      this.selectedGenre = null;
      this.seriesWithGenre = [];
      for (let index = 1; index <= 5; index++) {
        this.getSeries(index);
      }
    } else {
      this.selectedGenre = genre;
      this.seriesWithGenre = [];
      this.getSeriesWithGenre(genre);
    }
  }

  getSeriesWithGenre(genre: Genre) {
    const genreId = genre.id;
    this.seriesService.getSeriesByGenre(genreId).subscribe(
      (data: any) => {
        const series: Serie[] = data;
        for (let serie of series) {
          const seriesWithGenre: SeriesWithGenre = {
            id: serie.id,
            title: serie.original_name,
            genre: genre.name || 'Sin género',
            path: serie.poster_path
          };
          this.seriesWithGenre.push(seriesWithGenre);
        }
      },
      error => {
        console.log('Error al obtener las películas del género:', error);
      }
    );
  }
  
  getDetailsSerie(serie: SeriesWithGenre) {
    this.router.navigate(['/details-serie', serie.id]);
  }
}