import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: Boolean = false;
  isEditingPassword: boolean = false;

  constructor() { }

  openModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
  }
  
}
