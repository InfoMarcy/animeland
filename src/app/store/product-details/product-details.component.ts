import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { ProductService } from 'shared/services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Upload } from 'shared/models/products/product-images.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  public product: any;
  public slides = [];
  cart;
  totalPrice = 0;
  isfavorite: boolean;
  // public slideConfig = {'slidesToShow': 2, 'slidesToScroll': 2};

  constructor(private route: ActivatedRoute, public productService: ProductService,
    public cartService: ShoppingCartService, private router: Router,
    private snackbarService :SnackbarService) {
    const id = this.route.snapshot.paramMap.get('id');

    this.productService.getProductById(id).then(product => {

      this.productService.getById(id).collection('uploads').valueChanges().subscribe(uploadSnap => {
        uploadSnap.map((upload: Upload) => {

          this.slides.push({ img: upload.url });
        });
      });


      this.product = product;
    });

  }

  ngOnInit() {
    this.cartService.myCart().subscribe(cart => {
      if (cart) {
        if (cart.payload.data()) {
          this.cart = cart.payload.data();
          this.totalPrice = this.cartService.totalPrice(this.cart.products);
        }

      }

    });
    this.getQuantity();
  }

  //  // get the quantity of the product in the shopping cart
  getQuantity() {
    if (!this.cart) { return 0; } // check if there is a shopping cart

    for (const item of this.cart.products) {
      if (item.id === this.product.id) {
        return item.quantity;
      }
    }

    return 0;

  }


  addToCart(){
    this.cartService.addToCart(this.product, 1);
    }
    
           // update a product on the cart
    update(productQuantity) {
    
      let qty: number = parseInt(productQuantity);
    
      if (qty == 0) {
    
        qty = 1;
      }
      this.cartService.updateProduct(this.product, qty).then(() => {
      this.snackbarService.launch('Producto Actualizado', 'Carrito', 4000);
        // this.appService.stopLoader();
      }).catch(error => {
        this.snackbarService.launch('Error Actualizando el producto', 'Carrito', 4000);
        // this.appService.stopLoader();
      });
    
    }
    

    ComprarAhora(productQuantity){

      if(productQuantity == 0){
        this.addToCart();
      }
      this.update(productQuantity);

      this.router.navigate(['/check-out']);

    }


    // toggle the hearts for the product
    favoriteFlag(){
      this.isfavorite = !this.isfavorite;
    }
}
