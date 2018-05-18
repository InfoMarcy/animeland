import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CategoryService } from 'shared/services/product/category.service';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'shared/services/app/app.service';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { ProductService } from 'shared/services/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   //hold the list of categories as an observable
   ListOfCategories;
   constructor(private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private snackbarService: SnackbarService,
    private appService: AppService,
    private route: ActivatedRoute,
    private categoryService: CategoryService) {     }

  filteredProducts: any[] = [];
  toFilteredProducts: any[] = [];
 category: string;
 public products: any;
cart: any;
totalPrice = 0;

// update the quantity of the cart products
ngOnInit() {
  this.getCategories();
 this.products = this.productService.getAll().snapshotChanges().map(productSnaps => {
   return productSnaps.map(product => {
     const productData = product.payload.doc.data();
     const productId = product.payload.doc.id;
     return this.productService.getProductImages(productId).snapshotChanges().map(uploadSnap => {
       let number = 0;
       return uploadSnap.map(upload => {
         if (number == 0) {
           number++;
           return upload.payload.doc.data();
         }
       });
     })
     .map(uploads => {
       return {productId, ...productData, uploads: uploads};
     });
   });
 })
 .flatMap(products => Observable.combineLatest(products))
 .switchMap(products => {
       this.toFilteredProducts = products;
       return this.route.queryParamMap;
       })
     .subscribe(params => {
      
      if(params.get('subcategory') != null) {
     
        this.category = params.get('subcategory');
        this.filteredProducts = (this.category) ?
        this.toFilteredProducts.filter(p => p.subcategory === this.category) : this.toFilteredProducts;
      } else {
        this.category = params.get('category');
        this.filteredProducts = (this.category) ?
        this.toFilteredProducts.filter(p => p.category === this.category) : this.toFilteredProducts;
      }

       
     });

 this.shoppingCartService.myCart().subscribe(cart => {
   if (cart) {
     if (cart.payload.data()) {
       this.cart = cart.payload.data();
       this.totalPrice = this.shoppingCartService.totalPrice(this.cart.products);
     }

   }

 });

}

// get the list of categories
getCategories() {
  this.categoryService.getAll().subscribe(categories => {
    this.ListOfCategories = categories;
   
  });
}


}
