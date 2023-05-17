import { Component } from '@angular/core';
import { ListsService } from '../services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent {

  listId!: string;
  list!: any;
  listDetails: any[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private listsService: ListsService,
    private moviesService: MoviesService,
    private seriesService: SeriesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id!== null) this.listId = id;
    });
    this.getListById(this.listId);
  }

  getListById(listId: string) {
    this.listsService.getListById(listId).subscribe({
      next: (data:any) => {
        this.list = data;
        this.list.listM_S.forEach((item: any) => {
          if (item.movieId) {
            this.getMovieDetail(item.movieId);
          } else if (item.serieId) {
            this.getSerieDetail(item.serieId);
          }
        });
        console.log(this.listDetails);
        
      },
      error: () => {
        this.router.navigate(['/home'])
      }
    })
  }

  getMovieDetail(id: string) {
    this.moviesService.getDetails(id).subscribe({
      next: (movie) => {
        const movieWithType: any = { ...movie, typeOf: 'movie' };
        this.listDetails.push(movieWithType);
      }
    });
  }

  getSerieDetail(id: string) {
    this.seriesService.getDetails(id).subscribe({
      next: (serie) => {
        const serieWithType: any = { ...serie, typeOf: 'serie' };
        this.listDetails.push(serieWithType);
      }
    });
  }

}
