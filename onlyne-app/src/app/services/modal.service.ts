import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: Boolean = false;
  isEditingPassword: boolean = false;

  constructor() { }

  openModal() {
    console.log("---open---");
    this.modal = true;
  }

  closeModal() {
    console.log("---cerrar---");
    this.modal = false;
  }

}
