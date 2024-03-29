import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { Moda2Service } from './modal/moda2.service';
import Swal from 'sweetalert2';
import { ListsService } from '../services/lists.service';
import { List } from '../interfaces/list.interfaces';
import { apiUrl } from '../../assets/js/config';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  
  apiUrl = apiUrl;

  token!: string;
  client!: Client;
  selectedClient!: Client;
  selectedPhoto!: File | null;
  selectedListPhoto!: File | null;
  selectedDefaultPhoto!: string;
  currentPhoto!: any;

  userLists!: List[];
  userFavoriteLists!: List[];
  listName!: string;
  listDescription!: string;
  selectedList!: any;
  selectedListId!:any;
  listNameEdit!: string;
  listDescriptionEdit!: string;
  visibility: string = 'Privada';

  constructor(private modalService: ModalService,
    protected authService: AuthService,
    protected moda2Service: Moda2Service,
    private listsService: ListsService) {}
  
  ngOnInit(): void {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getClient();
    this.currentPhoto = this.client?.profilePhoto;
    this.getUserLists();
    this.getUserFavoriteLists();
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
      this.userLists.forEach(list => {
        this.listsService.getFollowersOfList(list._id).subscribe({
          next: (data:any) => {
            list.followers = data.count;
          }
        });
      });
    });
  }

  getUserFavoriteLists() {
    this.listsService.getUserFavouriteLists(this.client.id).subscribe((data: any) => {
      this.userFavoriteLists = data;
      this.userFavoriteLists.forEach(list => {
        this.listsService.getFollowersOfList(list._id).subscribe({
          next: (data:any) => {
            list.followers = data.count;
          }
        });
      });
    });
  }

  getListById(listId: string) {
    this.listsService.getListById(listId).subscribe({
      next: (data:any) => {
        this.selectedList = data;
        this.listNameEdit = data.title;
        this.listDescriptionEdit = data.description;
      }
    })
  }

  getFollowersOfList(listId: string) {
    this.listsService.getFollowersOfList(listId).subscribe({
      next: (data) => {
      }
    });
  }

  selectListId(listId: string) {
    this.selectedListId = listId;
    this.getListById(this.selectedListId);
  }

  uploadListPhoto(event: any) {
    this.selectedListPhoto = event.target.files[0];
    if (this.selectedListPhoto && this.selectedListPhoto.type.indexOf('image') < 0) {
      Swal.fire('Error al seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.selectedListPhoto = null;
    } else {
      if (this.selectedListPhoto) {
        this.listsService.uploadListPhoto(this.selectedListId, this.selectedListPhoto).subscribe({
          next: (data:any) => {
            Swal.fire({
              title: 'Foto actualizada',
              text: `La foto de la lista ${data.list.title} se ha actualizado correctamente`,
              icon: 'success',
              buttonsStyling: false,
              background: '#1e1e2a',
              color: 'white',
              customClass: {
                confirmButton: '#039be5'
              },
            })
            this.selectedList = data.list;
            this.getUserLists();
          }
        });
      }
    }
  }

  editList() {
    this.listsService.updateList(this.selectedListId, this.listNameEdit, this.listDescriptionEdit, this.visibility ).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Lista creada',
          text: `La lista ${data.result.title} se ha actualizado correctamente`,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.getUserLists();
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error al editar la lista',
          text: error.error.error,
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
        this.userLists.push(data.result);
        this.client.lists_created = this.userLists;
        this.getUserLists();
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

  deleteList(id:string) {
    this.listsService.deleteList(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Lista eliminada',
          text: data.message,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.userLists = this.userLists.filter(list => list._id !== id);
        this.client.lists_created = this.userLists;
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error al eliminar la lista',
          text: error,
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

  deleteFavoriteList(listId:string) {
    this.listsService.deleteFavouriteList(this.client.id, listId).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Lista eliminada',
          text: data.message,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.userFavoriteLists = this.userFavoriteLists.filter(list => list._id !== listId);
        this.client.lists_favourite = this.userFavoriteLists;
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error al eliminar la lista',
          text: error,
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

  photoSelected(event: any) {
    this.selectedPhoto = event.target.files[0];
    if (this.selectedPhoto && this.selectedPhoto.type.indexOf('image') < 0) {
      Swal.fire({
        title: 'Error al seleccionar imagen: ',
        text: 'El archivo debe ser del tipo imagen',
        icon: 'error',
        buttonsStyling: false,
        background: '#1e1e2a',
        color: 'white',
        customClass: {
          confirmButton: '#039be5'
        },
      })
      this.selectedPhoto = null;
    } else {
      this.uploadPhoto();
    }
  }

  uploadPhoto() {
    if (!this.selectedPhoto) {
      Swal.fire({
        title: 'Error al actualizar: ',
        text: 'Debes seleccionar una foto',
        icon: 'error',
        buttonsStyling: false,
        background: '#1e1e2a',
        color: 'white',
        customClass: {
          confirmButton: '#039be5'
        },
      })
    } else {
      this.authService.uploadPhoto(this.client.id, this.selectedPhoto)
      .subscribe(event => {
        this.client = event.user;
        this.currentPhoto = this.client.profilePhoto;
        Swal.fire({
          title: 'La foto se ha subido completamente! ',
          text: event.msg,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
      });
    }
  }

  selectDefaultPhoto(namePhoto: string) {
    this.currentPhoto = namePhoto;
    this.selectedDefaultPhoto = namePhoto;
  }

  uploadDefaultPhoto() {
    if (this.selectedDefaultPhoto != null) {
      this.authService.uploadDefaultPhoto(this.client.id, this.selectedDefaultPhoto).subscribe(event => {
        this.client = event.user;
        Swal.fire({
          title: 'La foto se ha actualizado completamente! ',
          text: event.msg,
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.selectedDefaultPhoto = '';
      });
    }
  }

  openModal(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }

}