import { Component } from '@angular/core';
import { Product } from '../../../models/product.model';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ProductListFilter } from '../../../models/filters/product-list-filter.model';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidePanelComponent } from '../../shared/side-panel/side-panel.component';
import { Observable } from 'rxjs';
import * as ProductActions from '../../../store/actions/productActions';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as ShoppingCartActions from '../../../store/actions/shoppingCartActions';
import { showProductAddedToShoppingCart } from '../../../shared/helpers/toast-message-service';
import { ToastrService } from 'ngx-toastr';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    PaginationComponent,
    HeaderComponent,
    SidePanelComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  productsState$: Observable<{
    pager: any;
    productList: Product[] | undefined | null;
  }>;

  filter: ProductListFilter = {
    categoryId: null,
    searchText: '',
    pageIndex: 1,
    pageSize: 10,
  };

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private toastrService: ToastrService,
    private actions$: Actions
  ) {
    this.productsState$ = this.store.select((state) => state.product.products);
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(ProductActions.loadProductsSuccess))
      .subscribe((data: any) => {
        let mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.getProducts();
  }

  getProducts() {
    this.store.dispatch(ProductActions.loadProducts({ filter: this.filter }));
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getProducts();
  }

  categoryChange(id: number) {
    this.filter = { ...this.filter, categoryId: id, pageIndex: 1 };
    this.getProducts();
  }

  searchTextChanged(searchText: string) {
    this.filter = { ...this.filter, searchText };
    this.getProducts();
  }

  goToDetails(id?: number) {
    this.router.navigate(['/details', id]);
  }

  addProductToCart(product: Product) {
    this.store.dispatch(
      ShoppingCartActions.addOrUpdateCart({
        shoppingCartItem: {
          productId: product.id,
          name: product.name!,
          description: product.description!,
          quantity: 1,
          imageName: product.imageName!,
          unitPrice: product?.price!,
          totalPrice: 1 * product?.price!,
        },
      })
    );
    showProductAddedToShoppingCart(this.toastrService);
  }
}
