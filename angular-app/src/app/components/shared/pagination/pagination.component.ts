import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Pager } from './../../../models/pager.model';
import { CommonModule } from '@angular/common';
import { map, range } from 'rxjs';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent implements OnChanges {
  @Input()
  pager: Pager = {
    currentPage: 0,
    endPage: 0,
    hasNext: false,
    hasPrevious: false,
    pageSize: 10,
    startPage: 0,
    totalItems: 0,
    totalPages: 0,
    paginationSummary: '',
  };
  @Output() pageChanged = new EventEmitter<number>();
  startEndIndexesArray: number[] = [];

  ngOnInit() {}

  changePage(page: number) {
    if (this.pager.currentPage === page) return;
    this.pageChanged.next(page);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.startEndIndexesArray = [];
    if (this.pager) {
      for (
        let page = this.pager.startPage;
        page <= this.pager.endPage;
        page++
      ) {
        this.startEndIndexesArray.push(page);
      }
    }
  }
}
