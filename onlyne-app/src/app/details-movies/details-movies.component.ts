import { Component } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { MovieDetails } from '../interfaces/details.interfaces';
import { Streaming } from '../interfaces/streaming.interface';
import { Cast } from '../interfaces/credits.interfaces';
import { Swiper } from 'swiper';
import { Moda2Service } from '../userprofile/modal/moda2.service';
import { ListsService } from '../services/lists.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Client } from '../interfaces/client.interface';
import { List } from '../interfaces/list.interfaces';
import { CommentService } from '../services/comment.service';
import { Comment } from '../interfaces/comment.interface';
import { apiUrl } from '../../assets/js/config';
import * as moment from 'moment';

@Component({
  selector: 'app-details',
  templateUrl: './details-movies.component.html',
  styleUrls: ['./details-movies.component.css']
})
export class DetailsComponent {

  apiUrl = apiUrl;
  
  cast: Cast[] = [];
  movie?: MovieDetails;
  trailer?: string;
  streaming?: Streaming;
  
  client!: Client;
  userLists!: List[];
  listName!: string;
  listDescription!: string;
  
  searchTerm: string = '';
  filteredLists: List[] = [];

  visibility: string = 'Privada';
  comment!: string;
  commentList!: Comment[];
  selectedStars: number = 1;
  stars = [1,2,3,4,5];
  ratingStars:any;
  roundedRating:any;

  constructor(private moviesService: MoviesService, 
    private activatedRoute: ActivatedRoute,
    protected moda2Service: Moda2Service,
    protected authService: AuthService,
    private listsService: ListsService,
    private commentService: CommentService) { }

  ngOnInit() {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getClient();
    if (this.client) {
      this.getUserLists();
    }
    this.getDetails();
    this.getTrailer();
    this.getActor();
    this.getMovieComments();

    const swiper = new Swiper('.swiper', {
      slidesPerView: 5.3,
      freeMode: true,
      spaceBetween: 15
    });
  }

  filterLists() {
    this.filteredLists = this.userLists.filter((list: List) =>
      list.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getDetails() {
    const { id } = this.activatedRoute.snapshot.params;
    this.moviesService.getDetails(id).subscribe(movie => {
      this.movie = movie;
      this.moviesService.getStreaming(id).subscribe(streaming => {
        this.streaming = streaming;
      });
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

  getClient() {
    this.client = this.authService.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  getUserLists() {
    this.listsService.getUserLists(this.client.id).subscribe((data: any) => {
      this.userLists = data;
      this.filteredLists = [...this.userLists];
      console.log("foreach de las listas");
      this.userLists.forEach(e => {
        console.log(e);
        
      });
    });
  }

  addToList(listId: string) {
    const { id } = this.activatedRoute.snapshot.params;
    this.listsService.checkMovieInList(listId, id).subscribe({
      next: (data: any) => {
        console.log(data);
        Swal.fire({
          title: 'La serie ya está añadida a la lista.',
          text: "¿Deseas añadirla de nuevo?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, añádela!',
          cancelButtonText: 'Cancelar',
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.addMovieToList(listId);
          } else if (result.dismiss) {
            Swal.fire({
              title: 'Cancelado!',
              text: 'No se ha añadido la película a la lista.',
              icon: 'error',
              background: '#1e1e2a',
              color: 'white',
              customClass: {
                confirmButton: '#039be5'
              }
            })
          }
        })
      },
      error: (error) => {
        if (error.status == 404) {
          this.addMovieToList(listId);
        }
      }
    });
  }

  addMovieToList(listId: string) {
    const { id } = this.activatedRoute.snapshot.params;
    this.listsService.addMovieToList(this.client.id, listId, id).subscribe({
      next: (data: any) => {
        console.log(data);
        Swal.fire({
          title: 'Añadido a la lista',
          text: `La pelicula/serie se ha añadido correctamente`,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.moda2Service.close();
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error al añadir la película a la lista',
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

  createList() {
    this.listsService.createList(this.listName, this.listDescription, this.client.id, this.visibility).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Lista creada',
          text: `La lista ${this.listName} se ha creado correctamente`,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.filteredLists.push(data.result);
        this.moda2Service.close();
      },
      error: (error: any) => {
        let e = error.error.error.match(/Error: (.+)/)[0];
        Swal.fire({
          title: 'Error al crear la lista',
          text: e,
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

  getMovieComments() {
    const { id } = this.activatedRoute.snapshot.params;
    this.commentService.getMovieComment(id).subscribe({
      next: (data: any) => {
        this.commentList = data.reverse();
        this.totalRatingComments();
      }
    });
  }

  addCommentToMovie() {
    const { id } = this.activatedRoute.snapshot.params;
    this.commentService.addCommentToMovie(this.client.id, id, this.comment, this.selectedStars).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Comentario añadido a la película',
          html: 'Se ha añadido el comentario la película correctamente',
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.getMovieComments();
      },
      error: (error: any) => {
        const errors:any = [];

        error.error.profanity.forEach((item: any) => {
          console.log(item);
          const errorMessage = `- Palabra Ofensiva: ${item.match}, Intesidad: ${item.intensity}, Tipo: ${item.type}`;
          errors.push(errorMessage);
        });

        error.error.link.forEach((item: any) => {
          console.log(item);
          const errorMessage = `- Link: ${item.match}, Categoria: ${item.category}`;
          errors.push(errorMessage);
        });

        const errorsString = errors.join("<br>");
        Swal.fire({
          title: error.error.message,
          html: errorsString,
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

  formatDate(comment: Comment) {
    moment.locale('es');
    const timeAgo = moment(comment.createdAt).fromNow();
    return timeAgo;
  }

  totalRatingComments() {
    const ratings = this.commentList.map(comment => comment.rating);
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 ? ratings.reduce((a, b) => a + b) / totalRatings : 0;
    this.roundedRating = Math.round(averageRating);
    if (!Number.isNaN(this.roundedRating)) {
      this.roundedRating = 0;
    }
    this.ratingStars = Array(5).fill(0).map((_, index) => index < this.roundedRating);
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Comentario eliminado',
          html: data.message,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.getMovieComments();
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error al eliminar el comentario',
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

}
