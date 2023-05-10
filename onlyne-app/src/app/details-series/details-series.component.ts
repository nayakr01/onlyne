import { Component } from '@angular/core';
import { SeriesService } from '../services/series.service';
import { ActivatedRoute } from '@angular/router';
import { SerieDetails } from '../interfaces/details.interfaces';
import { Cast } from '../interfaces/credits.interfaces';
import { Swiper } from 'swiper';
import { Streaming } from '../interfaces/streaming.interface';

@Component({
  selector: 'app-details-series',
  templateUrl: './details-series.component.html',
  styleUrls: ['./details-series.component.css']
})
export class DetailsSeriesComponent {
  constructor(private seriesService: SeriesService, private activatedRoute: ActivatedRoute) { }

  cast: Cast[] = [];
  serie?: SerieDetails;
  trailer?: string;
  streaming?: Streaming;

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
    this.seriesService.getDetails(id).subscribe(serie => {
      this.serie = serie;
      this.seriesService.getStreaming(id).subscribe(streaming => {
        this.streaming = streaming;
      });
    });
  }

  getTrailer() {
    const { id } = this.activatedRoute.snapshot.params;
    this.seriesService.getTrailer(id).subscribe((trailer) => {
      this.trailer = trailer;
    });
  }

  getActor() {
    const { id } = this.activatedRoute.snapshot.params;
    this.seriesService.getActor(id).subscribe(cast => {
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