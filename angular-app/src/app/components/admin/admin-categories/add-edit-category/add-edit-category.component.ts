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
  isFaClassSelected = true;
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
      faClass: [''],
      iconType: ['true'],
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
    if (category.imageName)
      this.categoryForm.get('imageName')?.setValue(category.imageName);
    if (category.faClass) {
      this.isFaClassSelected = true;
      this.categoryForm.get('faClass')?.setValue(category.faClass);
    } else {
      this.isFaClassSelected = false;
      this.imageFile.srcUrl = this.urlCategoryImages + category.imageName;
    }
    //set validators
    this.onIconTypeChange(this.isFaClassSelected);
  }

  onIconTypeChange(isFaClass: boolean) {
    this.isFaClassSelected = isFaClass;
    if (isFaClass) {
      this.categoryForm.get('faClass')!.setValidators(Validators.required);
      this.categoryForm.get('image')!.clearValidators();
    } else {
      if (!this.imageFile.srcUrl)
        this.categoryForm.get('image')!.setValidators(Validators.required);
      this.categoryForm.get('faClass')!.clearValidators();
    }
    if (!this.isFaClassSelected) this.categoryForm.get('faClass')?.setValue('');
    else {
      this.imageFile.srcUrl = '';
      this.categoryForm.get('image')?.setValue('');
      if (this.imageFileInput && this.imageFileInput.nativeElement)
        this.imageFileInput.nativeElement.value = '';
    }
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
    if (this.categoryForm.get('imageName')?.value) {
      categoryFormData.append(
        'imageName',
        this.categoryForm.get('imageName')?.value
      );
    }
    if (this.isFaClassSelected) {
      categoryFormData.append(
        'faClass',
        this.categoryForm.get('faClass')?.value
      );
    } else if (this.imageFile.file)
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
