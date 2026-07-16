import { Routes } from '@angular/router';
import { RoutePageComponent } from './features/route-page/route-page.component';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { VendorLayoutComponent } from './layouts/vendor-layout/vendor-layout.component';

export const routes: Routes = [
  { path: '', component: RoutePageComponent, data: { pageKey: 'home' } },
  { path: 'explore', component: RoutePageComponent, data: { pageKey: 'explore' } },
  { path: 'login', component: RoutePageComponent, data: { pageKey: 'login' } },
  { path: 'signup', component: RoutePageComponent, data: { pageKey: 'signup' } },
  { path: 'signup/customer', component: RoutePageComponent, data: { pageKey: 'signup' } },
  { path: 'signup/vendor', component: RoutePageComponent, data: { pageKey: 'signup' } },
  { path: 'profile', component: RoutePageComponent, data: { pageKey: 'profile' } },
  { path: 'orders', component: RoutePageComponent, data: { pageKey: 'orders' } },
  { path: 'cart', component: RoutePageComponent, data: { pageKey: 'cart' } },
  {
    path: 'customer',
    component: CustomerLayoutComponent,
    children: [
      { path: 'home', component: RoutePageComponent, data: { pageKey: 'home' } },
      { path: 'cart', component: RoutePageComponent, data: { pageKey: 'cart' } },
      { path: 'orders', component: RoutePageComponent, data: { pageKey: 'orders' } },
      { path: 'payment', component: RoutePageComponent, data: { pageKey: 'payment' } },
      { path: 'chat', component: RoutePageComponent, data: { pageKey: 'chat' } },
      { path: 'chat/:roomId', component: RoutePageComponent, data: { pageKey: 'chat' } },
      { path: '', pathMatch: 'full', redirectTo: 'home' }
    ]
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent,
    children: [
      { path: 'dashboard', component: RoutePageComponent, data: { pageKey: 'vendorDashboard' } },
      { path: 'dishes', component: RoutePageComponent, data: { pageKey: 'vendorDishes' } },
      { path: 'orders', component: RoutePageComponent, data: { pageKey: 'vendorOrders' } },
      { path: 'profile', component: RoutePageComponent, data: { pageKey: 'vendorProfile' } },
      { path: 'chat', component: RoutePageComponent, data: { pageKey: 'chat' } },
      { path: 'chat/:roomId', component: RoutePageComponent, data: { pageKey: 'chat' } },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: 'restaurant/dashboard', component: RoutePageComponent, data: { pageKey: 'vendorDashboard' } },
  { path: 'restaurant/menu', component: RoutePageComponent, data: { pageKey: 'vendorDishes' } },
  { path: 'restaurant/orders', component: RoutePageComponent, data: { pageKey: 'vendorOrders' } },
  { path: 'restaurant/:restaurant_name', component: RoutePageComponent, data: { pageKey: 'restaurantDetail' } },
  { path: 'admin', component: RoutePageComponent, data: { pageKey: 'admin' } },
  { path: 'admin/login', component: RoutePageComponent, data: { pageKey: 'login' } },
  { path: 'admin/payments', component: RoutePageComponent, data: { pageKey: 'payment' } },
  { path: '**', redirectTo: '' }
];
