import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Client } from '../interfaces/client.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  token!: string;

  user!: Client;

  ngOnInit() {
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
      console.log(this.user);
    }
  }

  logout() {
    localStorage.removeItem('token');
    location.reload();
    Swal.fire({
      title: 'Sesion cerrada',
      text: `Nos vemos ${this.user.name}`,
      icon: 'success',
      buttonsStyling: false,
      background: '#1e1e2a',
      color: 'white',
      customClass: {
        confirmButton: '#039be5'
      },
    })
  }

}
