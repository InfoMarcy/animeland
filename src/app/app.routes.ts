import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/products/admin-products/admin-products.component';
import { CategoryProductsComponent } from './admin/products/category-products/category-products.component';
import { AdminAuthGuard } from './admin/services/admin-auth-guard.service';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/service/auth.guard.service';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { CheckOutComponent } from './store/check-out/check-out.component';
import { MyOrdersComponent } from './store/my-orders/my-orders.component';
import { OrderSuccessComponent } from './store/order-success/order-success.component';
import { ShoppingCartComponent } from './store/shopping-cart/shopping-cart.component';
import { LoginGuardService } from './auth/service/login.guard.service';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './store/home/home.component';
import { ProductDetailsComponent } from './store/product-details/product-details.component';
import { RegistrarVentasComponent } from './administracion/registrar-ventas/registrar-ventas.component';
import { ResumenVentasDiariasComponent } from './administracion/resumen-ventas-diarias/resumen-ventas-diarias.component';
import { CreateAdminComponent } from './administracion/create-admin/create-admin.component';
import { VendedorAuthGuard } from 'admin/services/vendedor-auth-guard.service';
import { OrderDetailsComponent } from 'store/order-details/order-details.component';
import { ContactUsComponent } from 'shared/contact-us/contact-us.component';
import { MakePaymentComponent } from 'stripe/make-payment/make-payment.component';

export const router: Routes = [
    //routes for anonimous users
    { path: '', component: HomeComponent },
    { path: 'login', component: UserProfileComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'shopping-cart', component: ShoppingCartComponent },
    { path: 'contact-us', component: ContactUsComponent },
     //routes for normal users
    { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuard] },
    { path: 'mis/ordenes', component: MyOrdersComponent, canActivate: [AuthGuard] },
    { path: 'mis/ordenes/detalles/:id', component: OrderDetailsComponent, canActivate: [AuthGuard] },
    { path: 'orden-completada/:id', component: OrderSuccessComponent, canActivate: [AuthGuard] },
    { path: 'pago', component: MakePaymentComponent, canActivate: [AuthGuard] },
     //routes for admin users
     // AdminAuthGuard verify that the user is admin
     
    {
      path: 'admin/products/categories',
      component: CategoryProductsComponent,
      canActivate: [AuthGuard, VendedorAuthGuard]
    },

      {
        path: 'admin/products',
        component: AdminProductsComponent,
        canActivate: [AuthGuard, VendedorAuthGuard]
      },

      {
        path: 'admin/orders',
        component: AdminOrdersComponent,
        canActivate: [AuthGuard, AdminAuthGuard]
      } ,

      {
        path: 'admin',
        component: DashboardComponent,
        canActivate: [AuthGuard, AdminAuthGuard]
      }, 
      { path: 'ventas', 
      component: RegistrarVentasComponent,
       canActivate: [AuthGuard, VendedorAuthGuard] },
      { path: 'resumen', 
      component: ResumenVentasDiariasComponent,
       canActivate: [AuthGuard, VendedorAuthGuard] },
      { path: 'agregar/roles', 
      component: CreateAdminComponent, 
      canActivate: [AuthGuard, AdminAuthGuard] }


];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
