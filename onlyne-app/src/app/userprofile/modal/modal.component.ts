import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { Moda2Service } from './moda2.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {

    @Input() id?: string;
    isOpen = false;
    private element: any;

    constructor(private moda2Service: Moda2Service, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit() {
        // add self (this modal instance) to the modal service so it can be opened from any component
        this.moda2Service.add(this);

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        this.element.addEventListener('click', (el: any) => {
            if (el.target.className === 'jw-modal') {
                this.close();
            }
        });
    }

    ngOnDestroy() {
        // remove self from modal service
        this.moda2Service.remove(this);

        // remove modal element from html
        this.element.remove();
    }

    open() {
        this.element.style.display = 'block';
        document.body.classList.add('jw-modal-open');
        this.isOpen = true;
    }

    close() {
        this.element.style.display = 'none';
        document.body.classList.remove('jw-modal-open');
        this.isOpen = false;
    }

}
