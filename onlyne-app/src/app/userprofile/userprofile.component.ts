import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import { ClientService } from '../services/client.service';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {

  token!: string;
  user!: Client;
  selectedUser!: Client;

  constructor(private clientService: ClientService,
    private modalService: ModalService) {}
  
  ngOnInit(): void {
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    this.getUser();
  }

  getUser() {
    this.token = localStorage.getItem('token') || "";
    if(this.token != "") {
      const decodedToken: any = jwt_decode(this.token);
      this.user = {
        id: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email
      };
      console.log(this.user.id);
    }
    this.clientService.getUser(this.user.id, this.token).subscribe({
      next: (data) => {
        console.log("usuario:");
        console.log(data);
      }
    });
  }

  openModal(user: Client) {
    this.selectedUser = user;
    this.modalService.openModal();
  }

}