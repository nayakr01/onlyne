import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { Moda2Service } from './modal/moda2.service';
import Swal from 'sweetalert2';

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

  constructor(private clientService: ClientService,
    private modalService: ModalService,
    private authService: AuthService,
    protected moda2Service: Moda2Service) {}
  
  ngOnInit(): void {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getClient();
  }

  getClient() {
    this.client = this.authService.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  photoSelected(event: any) {
    if (this.selectedPhoto && this.selectedPhoto.type.indexOf('image') < 0) {
      Swal.fire('Error al seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.selectedPhoto = null;
    } else {
      this.selectedPhoto = event.target.files[0];
      console.log(this.selectedPhoto);
      this.uploadPhoto();
    }
  }

  uploadPhoto() {
    if (!this.selectedPhoto) {
      Swal.fire('Error Upload: ', 'Debes seleccionar una foto', 'error');
    } else {
      console.log("--uploadclient--");
      
      console.log(this.client.id);
      
      this.authService.uploadPhoto(this.client.id, this.selectedPhoto)
      .subscribe(event => {
        console.log("--event--");
        
        console.log(event);
        this.client = event.user;
        Swal.fire('La foto se ha subido completamente!', event.msg, 'success');
      });
    }
  }

  openModal(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }

}