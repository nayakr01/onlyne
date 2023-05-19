import { Component } from '@angular/core';
import { Client } from '../interfaces/client.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { apiUrl } from '../../assets/js/config';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  apiUrl = apiUrl;

  token!: string;

  client!: Client;

  constructor(protected authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getClient();
  }

  getClient() {
    this.client = this.authService.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    Swal.fire({
      title: 'Sesion cerrada',
      text: `Nos vemos ${this.client.name}`,
      icon: 'success',
      buttonsStyling: false,
      background: '#1e1e2a',
      color: 'white',
      customClass: {
        confirmButton: '#039be5'
      },
    })
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  searchContent(text:string) {
    text = text.trim();
    if(text.length === 0) {
      return;
    }
    this.router.navigate(['/search', text]);
  }
}
