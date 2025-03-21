import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { buildGetParams } from '../shared/helpers/build-get-params';

@Injectable()
export class CategoryService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}
  getAllCategories(filter: any) {
    return this.http.get(this.apiUrl + '/category/getall', {
      observe: 'response',
      params: buildGetParams(filter),
    });
  }

  getCategoryById(id: number) {
    return this.http.get(this.apiUrl + '/category/getbyid/?id=' + id);
  }

  addCategory(categoryFormData: FormData) {
    return this.http.post(this.apiUrl + '/category/create', categoryFormData);
  }

  editCategory(categoryFormData: FormData) {
    return this.http.put(this.apiUrl + '/category/edit', categoryFormData);
  }

  deleteCategoryById(id: number) {
    return this.http.delete(this.apiUrl + '/category/delete/?id=' + id);
  }
}
