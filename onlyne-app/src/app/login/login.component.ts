import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Client } from '../interfaces/client.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isOn!: boolean;
  email = "";
  password = "";
  client!: Client;
  name = "";

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.getClient();
  }

  getClient() {
    this.client = this.authService.getClient();
    this.authService.clientUpdated.subscribe((updatedClient) => {
      this.client = updatedClient;
    });
  }

  login() {
    this.authService.login(this.email, this.password)
      .subscribe({
        next: (data: any) => {
          console.log("--data--");
          console.log(data);
          this.client = {
            id: data._id,
            name: "",
            email: ""
          }
          // guardar token en local storage
          localStorage.setItem('token', data.token);
          this.client = this.authService.getClient();
          Swal.fire({
            title: 'Sesión iniciada',
            text: `Bienvenid@ ${this.client.name}`,
            icon: 'success',
            buttonsStyling: false,
            background: '#1e1e2a',
            color: 'white',
            customClass: {
              confirmButton: '#039be5'
            },
          })
            this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.log(error);
          Swal.fire({
            title: 'Error al iniciar sesión',
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

}