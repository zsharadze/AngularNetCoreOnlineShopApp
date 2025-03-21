import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppState } from './store/store';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/actions/authActions';
import { ShoppingCartLocalStorageManager } from './shared/helpers/shopping-cart-local-storage-manager';
import { AuthLocalStorageManager } from './shared/helpers/auth-local-storage-manager';
import { LoadingOverlayComponent } from './components/shared/loading-overlay/loading-overlay.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-app';
  constructor(
    private store: Store<AppState>,
    private productService: ProductService
  ) {}

  ngOnInit() {
    ShoppingCartLocalStorageManager.getShoppingCartItemsAndFillStore(
      this.store,
      this.productService
    );
    let userData = AuthLocalStorageManager.getUserData();
    const currentDate = new Date();
    let tokenExpirationDate = new Date(userData.tokenExpiration!);
    if (tokenExpirationDate > currentDate && userData.isAuthenticated != null) {
      this.store.dispatch(AuthActions.setAuthenticated());
    } else {
      console.log('token expired. setting unauthenticated');
      this.store.dispatch(AuthActions.setUnauthenticated());
    }
  }
}
