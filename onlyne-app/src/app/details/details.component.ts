import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { ActivatedRoute } from '@angular/router';
import { MovieDetails, SerieDetails } from '../interfaces/details.interfaces';
import { Cast } from '../interfaces/credits.interfaces';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  constructor(private moviesService: MoviesService, private seriesService: SeriesService, private activatedRoute: ActivatedRoute) { }

  cast: Cast[] = [];
  movie?: MovieDetails;
  serie?: SerieDetails;
  trailer?: string;

  ngOnInit() {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getDetails();
    this.getTrailer();
    this.getActor();

    const swiper = new Swiper('.swiper', {
      slidesPerView: 5.3,
      freeMode: true,
      spaceBetween: 15
    });
  }


  getDetails() {
    const { id } = this.activatedRoute.snapshot.params;
    this.moviesService.getDetails(id).subscribe(movie => {
      this.movie = movie;
    });

    this.seriesService.getDetails(id).subscribe(serie => {
      this.serie = serie;
    });
  }

  getTrailer() {
    const { id } = this.activatedRoute.snapshot.params;
    this.moviesService.getTrailer(id).subscribe((trailer) => {
      this.trailer = trailer;
    });
  }

  getActor() {
    const { id } = this.activatedRoute.snapshot.params;
    this.moviesService.getActor(id).subscribe(cast => {
      this.cast = cast;
    });
  }

  getStarRating(rating: number): string[] {
    const maxRating = 10;
    const numStars = 5;
    const ratingPerStar = maxRating / numStars;
    const ratingAsInt = Math.floor(rating / ratingPerStar);
    const ratingRemainder = rating % ratingPerStar;
    const fullStars = Array(ratingAsInt).fill('bx bxs-star');
    const halfStar = (ratingRemainder >= ratingPerStar / 2) ? ['bx bxs-star-half'] : [];
    const emptyStars = Array(numStars - fullStars.length - halfStar.length).fill('bx bx-star');
    return [...fullStars, ...halfStar, ...emptyStars];
  }
}
