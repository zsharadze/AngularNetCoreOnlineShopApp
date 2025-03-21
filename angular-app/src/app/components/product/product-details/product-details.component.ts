import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { Product } from '../../../models/product.model';
import * as ProductActions from '../../../store/actions/productActions';
import * as ShoppingCartActions from '../../../store/actions/shoppingCartActions';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { ShoppingCartLocalStorageManager } from '../../../shared/helpers/shopping-cart-local-storage-manager';
import { ShoppingCartItem } from '../../../models/shoppingCartItem.model';
import { showProductAddedToShoppingCart } from '../../../shared/helpers/toast-message-service';
import { ToastrService } from 'ngx-toastr';
import { Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FormsModule],
  providers: [ShoppingCartLocalStorageManager],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  selectedImageSrc = '';
  product$: Observable<Product>;
  shoppingCart$: Observable<ShoppingCartItem[]>;
  quantity = 1;
  selectedImageIndex: number = 0;
  unsubscribe$ = new Subject<void>(); //unsubscribe on ngOnDestroy to prevent multiple subscribtions in ngOnInit

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private store: Store<AppState>,
    private actions$: Actions,
    public location: Location,
  ) {
    this.product$ = this.store.select((state) => state.product.product);
    this.shoppingCart$ = this.store.select(
      (state) => state.shoppingCart.shoppingCart
    );
  }

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.store.dispatch(ProductActions.loadProduct({ id: Number(productId) }));
    this.actions$
      .pipe(
        ofType(ProductActions.loadProductSuccess),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data: { product: Product }) => {
        //set main image index
        let mainImageIndex = data.product.images.findIndex(
          (x) => x.imageName == data.product.imageName
        );
        this.selectedImageIndex = mainImageIndex;
        this.selectedImageSrc = this.urlProductImages + data.product.imageName;
        this.imageChangeAnimate(this.selectedImageSrc);
      });
  }

  addProductToCart(product: Product) {
    this.store.dispatch(
      ShoppingCartActions.addOrUpdateCart({
        shoppingCartItem: {
          productId: product.id,
          name: product.name!,
          description: product.description!,
          quantity: this.quantity,
          imageName: product.imageName!,
          unitPrice: product?.price!,
          totalPrice: this.quantity * product?.price!,
        },
      })
    );
    showProductAddedToShoppingCart(this.toastrService);
  }

  async showPreviousImage() {
    let images = (await firstValueFrom(this.product$)).images;
    if (this.selectedImageIndex - 1 < 0) {
      this.selectedImageIndex = 0;
    } else this.selectedImageIndex--;

    let newSrc: string =
      this.urlProductImages + images[this.selectedImageIndex].imageName;
    this.selectedImageSrc = newSrc;
    this.imageChangeAnimate(newSrc);
  }

  async showNextImage() {
    let images = (await firstValueFrom(this.product$)).images;
    if (this.selectedImageIndex + 1 >= images.length) {
      this.selectedImageIndex = 0;
    } else {
      this.selectedImageIndex++;
    }
    let newSrc: string =
      this.urlProductImages + images[this.selectedImageIndex].imageName;
    this.selectedImageSrc = newSrc;
    this.imageChangeAnimate(newSrc);
  }

  imageChangeAnimate(src: string) {
    let img: any = document.getElementById('image');
    img.classList.remove('show');
    img.classList.add('fade');
    setTimeout(function () {
      img.src = src;
      img.classList.remove('fade');
      img.classList.add('show');
    }, 100);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
