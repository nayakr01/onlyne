import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { ActivatedRoute } from '@angular/router';
import { MovieDetails, SerieDetails } from '../interfaces/details.interfaces';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  constructor(private moviesService: MoviesService, private seriesService: SeriesService, private activatedRoute: ActivatedRoute) { }

  movie?: MovieDetails;
  serie?: SerieDetails;

  ngOnInit() {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });

    const { id } = this.activatedRoute.snapshot.params;

    this.seriesService.getDetails(id).subscribe(serie => {
      this.serie = serie;
    });

    this.moviesService.getDetails(id).subscribe(movie => {
      this.movie = movie;
    });
  }

  getStarRating(rating: number): string[] {
    const roundedRating = Math.round(rating / 2);
    const fullStars = Array(roundedRating).fill('bx bxs-star');
    const halfStar = (roundedRating !== rating / 2) ? ['bx bxs-star-half'] : [];
    const emptyStars = Array(5 - fullStars.length - halfStar.length).fill('bx bx-star');
    return [...fullStars, ...halfStar, ...emptyStars];
  }
}
