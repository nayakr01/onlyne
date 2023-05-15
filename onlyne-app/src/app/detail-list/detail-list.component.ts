import { Component } from '@angular/core';
import { ListsService } from '../services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent {

  listId!: string;
  list!: any;
  movieDetails: any[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private listsService: ListsService,
    private moviesService: MoviesService) { }

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
        this.list.listM_S.forEach((movie: any) => {
          this.getMovieDetail(movie.itemId);
        });
        console.log(this.movieDetails);
        
      },
      error: () => {
        this.router.navigate(['/home'])
      }
    })
  }

  getMovieDetail(id: string) {
    this.moviesService.getDetails(id).subscribe(movie => {
      this.movieDetails.push(movie);
    });
  }

}
