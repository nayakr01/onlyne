import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { locales } from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  isOn!: boolean;
  email = "";

  constructor(private authService: AuthService,
    private router: Router) { }

  forgotPassword() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (data) => {
        console.log(data);
        Swal.fire({
          title: 'Correo Enviado',
          text: 'Verifique su bandeja de entrada de correo electrónico para completar el restablecimiento.',
          icon: 'success',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
        this.router.navigate(['login']);
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error al enviar el correo',
          text: error.error.message,
          icon: 'error',
          buttonsStyling: false,
          background: '#1e1e2a',
          color: 'white',
          customClass: {
            confirmButton: '#039be5'
          },
        })
      },
    });
  }

}
