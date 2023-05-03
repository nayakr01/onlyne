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
          this.authService.login(this.client.email, this.client.password)
          .subscribe({
            next: (data: any) => {
              localStorage.setItem('token', data.token);
              Swal.fire({
                title: 'Sesion inciada',
                text: `Bienvenido ${this.client.email}`,
                icon: 'success',
                buttonsStyling: false,
                background: '#1e1e2a',
                color: 'white',
                customClass: {
                  confirmButton: '#039be5'
                },
              })
            },
            error: (error: any) => {
              console.log(error);
              Swal.fire({
                title: 'Error al iniciar sesion',
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
        },
        error:(error: any) => {
          let errorMessage:any;
          if(error.status == 422) {
            let errorMessages = "";
            error.error.forEach((error:any) => {
              console.log(error)
              errorMessages += `${error.msg} \n`;
            });
            errorMessage = document.createElement('p');
            errorMessage.textContent = errorMessages;
          }
          if(error.status == 500) {
            console.log(error.error);
            const nameError = error.error.error.errors.name ? error.error.error.errors.name.message + '<br>' : '';
            const emailError = error.error.error.errors.email ? error.error.error.errors.email.message : '';
            errorMessage = `${nameError}${emailError}`;
          }
          Swal.fire({
            title: 'Error al registrarse',
            html: errorMessage,
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
