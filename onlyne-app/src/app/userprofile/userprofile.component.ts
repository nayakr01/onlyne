import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  token!: string;
  client!: Client;
  selectedClient!: Client;

  constructor(private clientService: ClientService,
    private modalService: ModalService,
    private authService: AuthService) {}
  
  ngOnInit(): void {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  getClient() {
    this.token = localStorage.getItem('token') || "";
    this.client = this.authService.getClient();
    this.clientService.getClient(this.client.id, this.token).subscribe({
      next: (data) => {
        console.log("cliente:",data);
        this.client = {
          id: data.msg._id,
          name: data.msg.name,
          email: data.msg.email,
          profilePhoto: data.msg.profilePhoto,
          lists_created: data.msg.lists_created,
          lists_favourite: data.msg.lists_favourite,
          ratings: data.msg.ratings
        };
        console.log(this.client);
      }
    });
  }

  openModal(client: Client) {
    this.selectedClient = client;
    this.modalService.openModal();
  }

}