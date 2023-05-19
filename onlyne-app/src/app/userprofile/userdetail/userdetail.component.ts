import { Component, Input } from '@angular/core';
import { Client } from 'src/app/interfaces/client.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent {

  title = "Detalles del Usuario";
  @Input() client!: Client;
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  constructor(public modalService: ModalService,
    private authService: AuthService) {}

  updateClient() {
    this.authService.updateClient(this.client.id, {newName: (document.getElementById('name') as HTMLInputElement).value,
      newEmail: (document.getElementById('email') as HTMLInputElement).value})
    .subscribe({
      next: (data:any) => {
        Swal.fire({
          title: 'Cliente actualizado',
          background: '#1e1e2a',
          color: 'white',
          text: 'El cliente se ha modificado correctamente!',
          icon: 'success',
          buttonsStyling: false,
          customClass: {
            confirmButton: '#039be5'
          },
        })
      },
      error: (error:any) => {
        Swal.fire({
          title: 'Error al actualizar tus datos',
          background: '#1e1e2a',
          color: 'white',
          html: error.error.msg,
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: '#039be5'
          },
        })
      }
    });
  }
  
  changePassword() {
    if (this.newPassword == this.confirmPassword) {
      this.authService.updatePasswordClient(this.client.id, { currentPassword: this.currentPassword,
        newPassword: this.newPassword})
        .subscribe({
          next: (data) => {
            Swal.fire({
              title: 'Contraseña cambiada',
              text: 'La contraseña se ha cambiado correctamente!',
              background: '#1e1e2a',
              color: 'white',
              icon: 'success',
              buttonsStyling: false,
              customClass: {
                confirmButton: '#039be5'
              },
            })
          },
          error: (error: any) => {
            let errorMessage:any;
            if(error.status == 422) {
              let errorMessages = "";
              error.error.errors.forEach((error:any) => {
                errorMessages += `${error.msg} \n`;
              }); 
              errorMessage = document.createElement('p');
              errorMessage.textContent = errorMessages;
            }
            if(error.status == 401) {
              errorMessage = `${error.error.error}`;
            }
            Swal.fire({
              title: 'Error al registrarse',
              background: '#1e1e2a',
              color: 'white',
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
      Swal.fire('Error al cambiar contraseña', 'Las contraseñas no coinciden', 'error');
    }
  }

  toggleEditingPassword(): void {
    this.modalService.isEditingPassword = !this.modalService.isEditingPassword;
  }
  
  closeModal() {
    this.modalService.closeModal();
  }

}
