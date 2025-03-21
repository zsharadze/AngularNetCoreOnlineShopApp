import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { ShoppingCartItem } from '../../../models/shoppingCartItem.model';
import { ShoppingCartLocalStorageManager } from '../../../shared/helpers/shopping-cart-local-storage-manager';
import { AuthState } from '../../../store/reducers/authReducer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  providers: [ShoppingCartLocalStorageManager],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  shoppingCart$: Observable<ShoppingCartItem[]>;
  authState$: Observable<AuthState>;
  shoppingCartItemsCount = 0;
  searchText = '';
  public searchTextChanged: Subject<string> = new Subject<string>();
  private unsubscribe$ = new Subject<string>();
  @Output() notifySearchTextChange: EventEmitter<string> = new EventEmitter();

  constructor(public router: Router, private store: Store<AppState>) {
    this.shoppingCart$ = this.store.select(
      (state) => state.shoppingCart.shoppingCart
    );
    this.authState$ = this.store.select((state) => state.auth);
  }

  ngOnInit() {
    this.shoppingCart$.subscribe((res) => {
      this.shoppingCartItemsCount = res.length;
    });
    this.searchTextChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchText: string) => {
        this.notifySearchTextChange.emit(searchText);
      });
  }

  navigateToMain() {
    if (this.router.url !== '/') this.router.navigateByUrl('/');
    else location.reload();
  }

  search() {
    this.notifySearchTextChange.emit(this.searchText);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('unsubscribe emit');
    this.unsubscribe$.complete();
    this.searchTextChanged.unsubscribe();
  }
}
