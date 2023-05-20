import { Component } from '@angular/core';
import { ListsService } from '../services/lists.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { SeriesService } from '../services/series.service';
import { Client } from '../interfaces/client.interface';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { apiUrl } from '../../assets/js/config';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css']
})
export class DetailListComponent {
  
  apiUrl = apiUrl;

  listId!: string;
  list!: any;
  listDetails: any[] = [];
  client!: Client;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private listsService: ListsService,
    private moviesService: MoviesService,
    private seriesService: SeriesService,
    private authService: AuthService) { }

  ngOnInit() {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id!== null) this.listId = id;
    });
    this.getClient();
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

  getClient() {
    this.client = this.authService.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  addListToFavourites() {
    this.listsService.addListToFavourites(this.client.id, this.listId).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Añadido a favoritos',
          text: data.message,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al añadir a favoritos',
          text: error.error.message,
          icon: 'error',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
      }
    });
  }

  removeMovieToList(item: string) {
    this.listsService.removeMovieToList(this.client.id, this.listId, item).subscribe({
      next: (data: any) => {
        this.listDetails = [];
        this.getListById(data.list._id)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  removeSerieToList(item: string) {
    this.listsService.removeSerieToList(this.client.id, this.listId, item).subscribe({
      next: (data: any) => {
        this.listDetails = [];
        this.getListById(data.list._id)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
