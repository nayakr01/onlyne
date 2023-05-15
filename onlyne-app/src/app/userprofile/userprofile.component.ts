import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { Moda2Service } from './modal/moda2.service';
import Swal from 'sweetalert2';
import { ListsService } from '../services/lists.service';
import { List } from '../interfaces/list.interfaces';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  token!: string;
  client!: Client;
  selectedClient!: Client;
  selectedPhoto!: File | null;
  selectedDefaultPhoto!: string;
  currentPhoto!: any;

  userLists!: List[];
  listName!: string;
  listDescription!: string;
  selectedList!: any;
  selectedListId!:any;
  listNameEdit!: string;
  listDescriptionEdit!: string;

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
      console.log("foreach de las listas");
      this.userLists.forEach(e => {
        console.log(e);
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

  selectListId(listId: string) {
    this.selectedListId = listId;
    this.getListById(this.selectedListId);
  }

  editList() {
    this.listsService.updateList(this.selectedListId, this.listNameEdit, this.listDescriptionEdit).subscribe({
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
    this.listsService.createList(this.listName, this.listDescription, this.client.id).subscribe({
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
      Swal.fire('Error al seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.selectedPhoto = null;
    } else {
      this.uploadPhoto();
    }
  }

  uploadPhoto() {
    if (!this.selectedPhoto) {
      Swal.fire('Error Upload: ', 'Debes seleccionar una foto', 'error');
    } else {
      this.authService.uploadPhoto(this.client.id, this.selectedPhoto)
      .subscribe(event => {
        this.client = event.user;
        this.currentPhoto = this.client.profilePhoto;
        Swal.fire('La foto se ha subido completamente!', event.msg, 'success');
      });
    }
  }

  selectDefaultPhoto(namePhoto: string) {
    this.currentPhoto = namePhoto;
    this.selectedDefaultPhoto = namePhoto;
  }

  uploadDefaultPhoto() {
    console.log("--uploaddefaulthoto--");
    console.log(this.selectedDefaultPhoto);
    
    if (this.selectedDefaultPhoto != null) {
      this.authService.uploadDefaultPhoto(this.client.id, this.selectedDefaultPhoto).subscribe(event => {
        this.client = event.user;
        Swal.fire('La foto se ha actualizado correctamente!', event.msg, 'success');
        this.selectedDefaultPhoto = '';
      });
    }
  }

  openModal(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }

}