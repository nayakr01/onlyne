import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isOn!: boolean;
  email = "";
  password = "";

  constructor(private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    
  }

  login() {
    this.authService.login(this.email, this.password)
      .subscribe({
        next:(data: any) => {
          // guardar token en local storage
          localStorage.setItem('token', data.token);
          Swal.fire({
            title: 'Sesion inciada',
            text: `Bienvenido ${this.email}`,
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: '#039be5'
            },
          })
          this.router.navigate(['']);
        },
        error:(error: any) => {
          console.log(error);
          Swal.fire({
            title: 'Error al iniciar sesion',
            text: error.error.message,
            icon: 'error',
            buttonsStyling: false,
            customClass: {
              confirmButton: '#039be5'
            },
          })
        }
    });
  }

}
