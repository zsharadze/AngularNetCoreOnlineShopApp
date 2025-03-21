import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { buildGetParams } from '../shared/helpers/build-get-params';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable()
export class ProductService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllProducts(filter: any) {
    return this.http.get(this.apiUrl + '/product/getall', {
      observe: 'response',
      params: buildGetParams(filter),
    });
  }

  getProductsByIds(productIdsFormData: FormData): Observable<Product[]> {
    return this.http.post<Product[]>(
      this.apiUrl + '/product/getbyids',
      productIdsFormData
    );
  }
  getProductById(id: number) {
    return this.http.get(this.apiUrl + '/product/getbyid/?id=' + id);
  }

  addProduct(productFormData: FormData) {
    return this.http.post(this.apiUrl + '/product/create', productFormData);
  }

  updateProduct(productFormData: FormData) {
    return this.http.put(this.apiUrl + '/product/edit', productFormData);
  }

  deleteProductById(id: number) {
    return this.http.delete(this.apiUrl + '/product/delete/?id=' + id);
  }
}
