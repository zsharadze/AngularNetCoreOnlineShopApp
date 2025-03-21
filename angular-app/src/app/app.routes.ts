import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product/product-details/product-details.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { LogoutComponent } from './components/auth/logout/logout.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AuthGuard } from './shared/auth-guard/auth-guard.component';
import { ChangePasswordComponent } from './components/auth/change-password/change-password.component';
import { AdminOrdersComponent } from './components/admin/admin-orders/admin-orders.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { AddEditProductComponent } from './components/admin/admin-products/add-edit-product/add-edit-product.component';
import { AddEditCategoryComponent } from './components/admin/admin-categories/add-edit-category/add-edit-category.component';

export const routes: Routes = [
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: 'shoppingcart', component: ShoppingCartComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/logout', component: LogoutComponent },
  { path: 'auth/changepassword', component: ChangePasswordComponent },
  {
    path: 'myorders',
    component: MyOrdersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['User', 'Admin'] },
  },
  {
    path: 'admin',
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'addproduct',
    component: AddEditProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'editproduct/:id',
    component: AddEditProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'addcategory',
    component: AddEditCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'editcategory/:id',
    component: AddEditCategoryComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  { path: '**', component: ProductListComponent },
];
