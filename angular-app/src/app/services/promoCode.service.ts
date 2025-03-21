import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { buildGetParams } from '../shared/helpers/build-get-params';
import { PromoCodeListFilter } from '../models/filters/promo-code-list-filter.model';

@Injectable()
export class PromoCodeService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllPromoCodes(filter: PromoCodeListFilter) {
    return this.http.get(this.apiUrl + '/promocode/getall', {
      observe: 'response',
      params: buildGetParams(filter),
    });
  }

  getByPromoCodeText(promoCodeText: string) {
    return this.http.post(this.apiUrl + '/promocode/getbypromocodetext', {
      promoCodeText: promoCodeText,
    });
  }

  generatePromoCodes(quantity: number, discount: number) {
    return this.http.post(this.apiUrl + '/promocode/generatepromocodes', {
      quantity: quantity,
      discount: discount,
    });
  }

  deletePromoCodeById(id: number) {
    return this.http.delete(this.apiUrl + '/promocode/delete/?id=' + id);
  }
}
