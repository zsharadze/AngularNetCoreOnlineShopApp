import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../../../models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../../../store/store';
import { Store } from '@ngrx/store';
import * as CategoryActions from './../../../../store/actions/categoryActions';
import { Actions, ofType } from '@ngrx/effects';
import { CategoryService } from '../../../../services/category.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-add-edit-category',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-edit-category.component.html',
  styleUrl: './add-edit-category.component.css',
})
export class AddEditCategoryComponent {
  urlCategoryImages = environment.CATEGORY_IMAGES_URL;
  categoryForm: FormGroup;
  editCategoryId = 0;
  imageFile: {
    srcUrl: string;
    file: File | null;
  } = { srcUrl: '', file: null };
  @ViewChild('imageInput')
  imageFileInput!: ElementRef;
  constructor(
    public location: Location,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private actions$: Actions,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      imageName: [''],
      image: [''],
    });
  }
  ngOnInit() {
    this.editCategoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.editCategoryId) {
      this.store.dispatch(
        CategoryActions.loadCategory({ id: Number(this.editCategoryId) })
      );
      this.actions$
        .pipe(ofType(CategoryActions.loadCategorySuccess))
        .subscribe((data: { category: Category }) => {
          this.setInputsOnEdit(data.category);
        });
    }
  }

  setInputsOnEdit(category: Category) {
    this.categoryForm.get('id')?.setValue(this.editCategoryId);
    this.categoryForm.get('name')?.setValue(category.name);
    this.categoryForm.get('imageName')?.setValue(category.imageName);
    this.imageFile.srcUrl = this.urlCategoryImages + category.imageName;
  }

  onInputImageFileChange(event: any) {
    let file: File = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const url = (<FileReader>event.target).result as string;
      this.imageFile = { ...this.imageFile, srcUrl: url, file: file };
    };
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      console.log('form is invalid');
      Object.keys(this.categoryForm.controls).forEach((key) => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    let categoryFormData = new FormData();
    categoryFormData.append('id', this.editCategoryId.toString());
    categoryFormData.append('name', this.categoryForm.get('name')?.value);
    categoryFormData.append(
      'imageName',
      this.categoryForm.get('imageName')?.value
    );
    if (this.imageFile.file)
      categoryFormData.append('Image', this.imageFile.file);

    if (!this.editCategoryId) {
      this.categoryService.addCategory(categoryFormData).subscribe((res) => {
        this.router.navigateByUrl('/admin?activeTab=Categories');
      });
    } else {
      this.categoryService.editCategory(categoryFormData).subscribe((res) => {
        this.router.navigateByUrl('/admin?activeTab=Categories');
      });
    }
  }
}
