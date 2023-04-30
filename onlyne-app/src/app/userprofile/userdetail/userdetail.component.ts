import { Component, Input } from '@angular/core';
import { Client } from 'src/app/interfaces/client.interface';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent {

  title = "Detalles del Usuario";
  @Input () user!: Client;

  constructor(public modalService: ModalService) {}

  closeModal() {
    this.modalService.closeModal();
  }

}
