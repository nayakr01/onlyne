import { Component } from '@angular/core';
import { Client } from '../interfaces/client.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  token!: string;

  client!: Client;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  getClient() {
    this.client = this.authService.getClient();
    this.authService.getClientData(this.client.id).subscribe({
      next: (data: any) => {
        this.client = {
          id: data.msg._id,
          name: data.msg.name,
          email: data.msg.email,
          profilePhoto: data.msg.profilePhoto,
          lists_created: data.msg.lists_created,
          lists_favourite: data.msg.lists_favourite,
          ratings: data.msg.ratings
        };
      },
      error: (error: any) => {
        console.log('Error al obtener las series:', error);
      }
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
