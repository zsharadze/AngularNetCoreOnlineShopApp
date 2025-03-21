import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import * as CategoryActions from '../../../store/actions/categoryActions';
import { CategoryListFilter } from '../../../models/filters/category-list-filter.model';
import { Actions } from '@ngrx/effects';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css',
})
export class SidePanelComponent {
  urlCategoryImages = environment.CATEGORY_IMAGES_URL;
  categoriesState$: Observable<{ pager: any; categoryList: Category[] | any }>;
  @Output() notifyCategoryChange = new EventEmitter<number>();

  filter: CategoryListFilter = {
    searchText: '',
    pageIndex: 1,
    pageSize: 5000,
  };
  constructor(private store: Store<AppState>, private actions$: Actions) {
    this.categoriesState$ = this.store.select(
      (state) => state.category.categories
    );
  }

  ngOnInit() {
    this.getCategories();
  }
  getCategories() {
    this.store.dispatch(
      CategoryActions.loadCategories({ filter: this.filter })
    );
  }

  categoryClick(id?: number) {
    this.notifyCategoryChange.emit(id);
  }
}
