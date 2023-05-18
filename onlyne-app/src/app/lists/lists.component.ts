import { Component } from '@angular/core';
import { List } from '../interfaces/list.interfaces';
import { ListsService } from '../services/lists.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent {

  lists!: Array<List>;

  constructor(private listsService: ListsService) {}

  ngOnInit() {
    let lists = document.getElementById('lists');
    document.querySelectorAll('.nav-link').forEach(function (elem) {
      elem.classList.remove('nav-active');
    });
    lists?.classList.add('nav-active');
    this.getAllLists();
  }

  getAllLists() {
    this.listsService.getAllLists().subscribe({
      next: (data) => {
        this.lists = data;
      }
    });
  }
}