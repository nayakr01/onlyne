import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Client } from './client';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  client = new Client();
  password2!: string;

  constructor(private router: Router,
    private authService: AuthService) {}

  onSubmit() {
    if (this.client.password === this.password2) {
      this.authService.register(this.client.name, this.client.email, this.client.password)
      .subscribe({
        next: (data) => {
          console.log(data);
          Swal.fire({
            title: 'Sesion inciada',
            text: `Bienvenido ${data}`,
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: '#039be5'
            },
          })
        },
        error:(error: any) => {
          console.log(error);
          Swal.fire({
            title: 'Error al registrarse',
            text: error.error,
            icon: 'error',
            buttonsStyling: false,
            customClass: {
              confirmButton: '#039be5'
            },
          })
        }
      });
    } else {
      Swal.fire({
        title: 'Las contraseñas tienen que ser iguales',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
          confirmButton: '#039be5'
        },
      })
    }
  }

}
