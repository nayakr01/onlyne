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
