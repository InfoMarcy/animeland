import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSort,
  MatSortModule,
  MatTableModule,
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VendedorAuthGuard } from 'admin/services/vendedor-auth-guard.service';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { CreateAdmin } from 'auth/service/create-admin.service';
import { CustomFormsModule } from 'ng2-validation';
import { ContactUsComponent } from 'shared/contact-us/contact-us.component';
import { AppErrorHandler } from 'shared/errors/app-error.handler';
import { NavbarComponent } from 'shared/navbar/navbar.component';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { AppService } from 'shared/services/app/app.service';
import { OrderService } from 'shared/services/checkout/order.service';
import { InventoryService } from 'shared/services/inventory/inventory.service';
import { OrderDetails } from 'shared/services/order-details/order-details.service';
import { CategoryService } from 'shared/services/product/category.service';
import { ProductService } from 'shared/services/product/product.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { UploadService } from 'shared/services/product/upload.service';
import { VentasService } from 'shared/services/ventas/ventas.service';

import { environment } from './../environments/environment.prod';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminProductsComponent } from './admin/products/admin-products/admin-products.component';
import { CategoryProductsComponent } from './admin/products/category-products/category-products.component';
import { ProductCardComponent } from './admin/products/product-card/product-card.component';
import { ProductDialogComponent } from './admin/products/product-dialog/product-dialog.component';
import { ProductFilterComponent } from './admin/products/product-filter/product-filter.component';
import { ShippingFormComponent } from './admin/products/shipping-form/shipping-form.component';
import { ShoppingCartSummaryComponent } from './admin/products/shopping-cart-summary/shopping-cart-summary.component';
import { UploadFormComponent } from './admin/products/upload-form/upload-form.component';
import { AdminAuthGuard } from './admin/services/admin-auth-guard.service';
import { CreateAdminComponent } from './administracion/create-admin/create-admin.component';
import { RegistrarVentasComponent } from './administracion/registrar-ventas/registrar-ventas.component';
import { ResumenVentasDiariasComponent } from './administracion/resumen-ventas-diarias/resumen-ventas-diarias.component';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/service/auth.guard.service';
import { AuthService } from './auth/service/auth.service';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { CheckOutComponent } from './store/check-out/check-out.component';
import { HomeComponent } from './store/home/home.component';
import { MyOrdersComponent } from './store/my-orders/my-orders.component';
import { OrderDetailsComponent } from './store/order-details/order-details.component';
import { OrderSuccessComponent } from './store/order-success/order-success.component';
import { ProductDetailsComponent } from './store/product-details/product-details.component';
import { ShoppingCartComponent } from './store/shopping-cart/shopping-cart.component';
import { MakePaymentComponent } from './stripe/make-payment/make-payment.component';
import { PaymentService } from 'stripe/services/payment.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CheckOutComponent,
    ShoppingCartComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    ContactUsComponent,
    ProductFilterComponent,
    ProductCardComponent,
    ShoppingCartSummaryComponent,
    ShippingFormComponent,
    CategoryProductsComponent,
    RegisterComponent,
    UserProfileComponent,
    DashboardComponent,
    ProductDialogComponent,
    UploadFormComponent,
    ProductDetailsComponent,
    RegistrarVentasComponent,
    ResumenVentasDiariasComponent,
    CreateAdminComponent,
    OrderDetailsComponent,
    MakePaymentComponent
   
   
  ],
  entryComponents: [
    ProductDialogComponent
  ],
  imports: [
// imports modules
  //  StripeModule,
    BrowserModule,
    //material design
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatProgressBarModule,
    routes,
    HttpModule,
    FormsModule,
    CustomFormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    MatProgressSpinnerModule,
    AngularFireAuthModule,
    AngularFontAwesomeModule,
    MatSnackBarModule,
    MatDialogModule,
    MatGridListModule,
    MatToolbarModule,
    MatCardModule
  ],
  providers: [{provide: ErrorHandler, useClass: AppErrorHandler },
    AuthService, AuthGuard, AdminAuthGuard, CategoryService,
     ProductService, ShoppingCartService, OrderService, MatSort, 
     AppService, SnackbarService, UploadService,VentasService,CreateAdmin, 
     VendedorAuthGuard, OrderDetails, InventoryService, PaymentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
