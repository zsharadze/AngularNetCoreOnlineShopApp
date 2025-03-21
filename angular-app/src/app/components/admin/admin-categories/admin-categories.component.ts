import { Component, ViewChild } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { Category } from '../../../models/category.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/store';
import * as CategoryActions from '../../../store/actions/categoryActions';
import { CategoryListFilter } from '../../../models/filters/category-list-filter.model';
import { Actions, ofType } from '@ngrx/effects';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { ModalDialogComponent } from '../../shared/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    ModalDialogComponent,
  ],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css',
})
export class AdminCategoriesComponent {
  urlCategoryImages = environment.CATEGORY_IMAGES_URL;
  categoriesState$: Observable<{ pager: any; categoryList: Category[] | any }>;
  filter: CategoryListFilter = {
    searchText: '',
    pageIndex: 1,
    pageSize: 10,
  };
  public searchTextChanged: Subject<string> = new Subject<string>();
  private unsubscribe$ = new Subject<string>();
 @ViewChild(ModalDialogComponent) modalDialogChild!: ModalDialogComponent;
  constructor(private store: Store<AppState>, private actions$: Actions) {
    this.categoriesState$ = this.store.select(
      (state) => state.category.categories
    );
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(CategoryActions.loadCategories))
      .subscribe((data: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.getCategories();
    this.searchTextChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchText: string) => {
        this.filter = { ...this.filter, searchText };
        this.getCategories();
      });
  }

  getCategories() {
    this.store.dispatch(
      CategoryActions.loadCategories({ filter: this.filter })
    );
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getCategories();
  }

  showDeleteConfirmModal(id: number) {
    this.modalDialogChild.showModal(id);
  }

  deleteCategory(categoryId: number) {
    this.store.dispatch(
      CategoryActions.deleteCategory({
        id: categoryId,
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('unsubscribe emit');
    this.unsubscribe$.complete();
    this.searchTextChanged.unsubscribe();
  }
}
