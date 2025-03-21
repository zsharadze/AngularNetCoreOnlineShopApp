import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateOrderRequest } from '../models/request-models/createOrderRequest.model';
import { buildGetParams } from '../shared/helpers/build-get-params';
import { ChangeOrderStatusRequest } from '../models/request-models/changeOrderStatusRequest.model';

@Injectable()
export class OrderService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  createOrder(createOrderRequest: CreateOrderRequest) {
    return this.http.post(
      this.apiUrl + '/order/createorder',
      createOrderRequest
    );
  }

  getAllOrdersForCurrentUser(filter: any) {
    return this.http.get(this.apiUrl + '/order/getallforcurrentuser', {
      observe: 'response',
      params: buildGetParams(filter),
    });
  }

  getAllOrders(filter: any) {
    return this.http.get(this.apiUrl + '/order/getall', {
      observe: 'response',
      params: buildGetParams(filter),
    });
  }

  changeStatus(changeOrderStatusRequest: ChangeOrderStatusRequest) {
    return this.http.post(
      this.apiUrl + '/order/changestatus',
      changeOrderStatusRequest
    );
  }
}
