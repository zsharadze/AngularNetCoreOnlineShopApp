import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { AdminOrdersComponent } from '../admin-orders/admin-orders.component';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminCategoriesComponent } from "../admin-categories/admin-categories.component";
import { AdminPromoCodesComponent } from "../admin-promo-codes/admin-promo-codes.component";

@Component({
  selector: 'app-admin-main',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminPromoCodesComponent
],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
})
export class AdminMainComponent {
  activeTab: 'Orders' | 'Products' | 'Categories' | 'PromoCodes' | '' = '';
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    let activeTab = this.route.snapshot.queryParams['activeTab'];
    if (activeTab) this.activeTab = activeTab;
    else this.activeTab = 'Orders';
  }

  changeTab(tab: any) {
    this.activeTab = tab;
    this.router.navigate([], {
      queryParams: {
        activeTab: tab,
      },
      queryParamsHandling: 'merge',
    });
  }
}
