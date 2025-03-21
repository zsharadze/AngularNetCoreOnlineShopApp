import { ChangeDetectorRef, Component } from '@angular/core';
import { Product, ProductImage } from '../../../../models/product.model';
import { ProductService } from '../../../../services/product.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Category } from '../../../../models/category.model';
import { AppState } from '../../../../store/store';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import * as CategoryActions from '../../../../store/actions/categoryActions';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { showToastMessage } from '../../../../shared/helpers/toast-message-service';
import { ToastrService } from 'ngx-toastr';
import * as ProductActions from '../../../../store/actions/productActions';
import { Actions, ofType } from '@ngrx/effects';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css',
})
export class AddEditProductComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  productForm: FormGroup;
  editProductId = 0;
  categories$: Observable<Category[] | undefined | null>;
  imageFileUrls: {
    id: number;
    imageName: string;
    imageUrl: string;
    newlyAddedFile: File | null;
  }[] = []; //imageUrl - base 64 string for images or full url path of image (on edit). used to show product images on page. newlyAddedFile is File that user selected from device
  deletedImages: { [key: number]: string } = {};
  mainImageIndex = 0;
  maxAllowedImagesCount = 5;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private store: Store<AppState>,
    private router: Router,
    private cf: ChangeDetectorRef,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private actions$: Actions,
    public location: Location
  ) {
    this.productForm = this.formBuilder.group({
      id: [],
      categoryId: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      productImage: ['', this.uploadImagesRequiredValidator],
    });
    this.categories$ = this.store.select(
      (state) => state.category.categories.categoryList
    );
  }

  ngOnInit() {
    this.editProductId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(
      CategoryActions.loadCategories({
        filter: { searchText: '', pageIndex: 1, pageSize: 5000 },
      })
    );
    if (this.editProductId) {
      this.actions$
        .pipe(ofType(CategoryActions.loadCategoriesSuccess))
        .subscribe((categories) => {
          this.store.dispatch(
            ProductActions.loadProduct({ id: Number(this.editProductId) })
          );
        });
      this.actions$
        .pipe(ofType(ProductActions.loadProductSuccess))
        .subscribe((data: { product: Product }) => {
          this.setInputsOnEdit(data.product);
          this.setImageFileUrlsOnEdit(data.product.images);
          this.setMainImageOnEdit(data.product.imageName!, data.product.images);
        });
    }
  }

  setImageFileUrlsOnEdit(productImages: ProductImage[]) {
    this.imageFileUrls = productImages.map((x) => ({
      id: x.id,
      imageName: x.imageName,
      imageUrl: this.urlProductImages + x.imageName,
      newlyAddedFile: null,
      newlyAddedFileUniqueId: null,
    }));
  }

  setMainImageOnEdit(mainImageName: string, productImages: ProductImage[]) {
    for (let ind = 0; ind < productImages.length; ind++) {
      if (mainImageName == productImages[ind].imageName) {
        this.mainImageIndex = ind;
        break;
      }
    }
  }

  setInputsOnEdit(product: Product) {
    this.productForm.get('id')?.setValue(this.editProductId);
    this.productForm.get('categoryId')?.setValue(product.categoryId);
    this.productForm.get('name')?.setValue(product.name);
    this.productForm.get('description')?.setValue(product.description);
    this.productForm.get('price')?.setValue(product.price);
  }

  onInputFileChange(event: any) {
    let fileCount = event.target.files && event.target.files.length;
    let files: File[] = event.target.files;
    if (this.imageFileUrls.length + fileCount <= this.maxAllowedImagesCount) {
      let i: number = 0;
      for (const singlefile of files) {
        let reader = new FileReader();
        reader.readAsDataURL(singlefile);
        this.cf.detectChanges();
        i++;
        reader.onload = (event) => {
          const url = (<FileReader>event.target).result as string;

          this.imageFileUrls.push({
            id: 0,
            imageName: '',
            imageUrl: url,
            newlyAddedFile: singlefile,
          });
          this.cf.detectChanges();
        };
      }
    } else {
      showToastMessage(
        this.toastrService,
        'Error',
        'No More than 5 images allowed',
        true
      );
      event.target.value = null;
    }
  }

  setMainImageIndex(i: number) {
    this.mainImageIndex = i;
  }

  removeImage(event: any, index: number) {
    event.stopPropagation();
    if (index === this.mainImageIndex) this.mainImageIndex = 0;

    if (this.imageFileUrls.length - 1 === this.mainImageIndex)
      this.mainImageIndex = 0;

    if (this.imageFileUrls[index].id && this.editProductId) {
      this.deletedImages[this.imageFileUrls[index].id] =
        this.imageFileUrls[index].imageName;
    }

    this.imageFileUrls.splice(index, 1);
  }

  getImageUrlsToShow() {
    return this.imageFileUrls.map((x) => x.imageUrl);
  }

  saveProduct() {
    if (this.productForm.invalid) {
      console.log('form is invalid');
      Object.keys(this.productForm.controls).forEach((key) => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.imageFileUrls.length === 0) {
      showToastMessage(this.toastrService, 'Error', 'Select images', true);
      return;
    }

    let productFormData = new FormData();
    productFormData.append('id', this.editProductId.toString());
    productFormData.append(
      'categoryId',
      this.productForm.get('categoryId')?.value
    );
    productFormData.append('name', this.productForm.get('name')?.value);
    productFormData.append(
      'description',
      this.productForm.get('description')?.value
    );
    productFormData.append('price', this.productForm.get('price')?.value);
    productFormData.append('mainImageIndex', this.mainImageIndex.toString());
    if (!this.editProductId) {
      for (const imageFile of this.imageFileUrls.map((x) => x.newlyAddedFile)) {
        productFormData.append('imageFiles', imageFile!);
      }

      this.productService.addProduct(productFormData).subscribe((res) => {
        this.router.navigateByUrl('/admin?activeTab=Products');
      });
    } else {
      if (this.deletedImages) {
        productFormData.append(
          'deletedImages',
          JSON.stringify(this.deletedImages)
        );
      }

      productFormData.append('mainImageIndex', this.mainImageIndex.toString());
      for (let ind = 0; ind < this.imageFileUrls.length; ind++) {
        productFormData.append(
          `ImagesOnEdit[${ind}].id`,
          this.imageFileUrls[ind].id.toString()
        );
        productFormData.append(
          `ImagesOnEdit[${ind}].imageName`,
          this.imageFileUrls[ind].imageName.toString()
        );

        if (this.imageFileUrls[ind].newlyAddedFile)
          productFormData.append(
            `ImagesOnEdit[${ind}].imageFile`,
            this.imageFileUrls[ind].newlyAddedFile!
          );
      }

      this.productService.updateProduct(productFormData).subscribe((res) => {
        this.router.navigateByUrl('/admin?activeTab=Products');
      });
    }
  }

  uploadImagesRequiredValidator(): ValidatorFn {
    return this?.editProductId == 0
      ? Validators.required
      : Validators.nullValidator;
  }
}
