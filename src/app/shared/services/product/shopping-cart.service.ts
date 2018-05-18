import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as faker from 'faker';

import { AuthService } from 'auth/service/auth.service';
import { Cart } from 'shared/models/cart.model';
import { Product } from 'shared/models/products/product.model';
import { SnackbarService } from '../angular-material/snack-bar.service';
import { ProductService } from './product.service';

@Injectable()
export class ShoppingCartService {
  // inject angular firebase database
  constructor(private db: AngularFirestore, public auth: AuthService, private productService: ProductService, private snackbarService: SnackbarService) {  }

  // this find the total products on the cart
  static totalProductsInCart(products: Product[]) {
    let sum = 0;
    for (let i = 0; i < products.length; i++) {
      sum += parseInt(products[i]['quantity']);
    }
    return sum;
  }

  // add or create a cart
  createCart() {
    const id = faker.random.alphaNumeric(16);
    this.db.collection('carts').doc(id).set(
      {
        dateCreated: new Date().getTime(),
        id: id,
        products: [],
        totalProducts: 0
      }
    );
    localStorage.setItem('cartId', id);
  }

  // get the cart for the customer
  myCart() {
    const cartId = localStorage.getItem('cartId');
    return this.db.doc<Cart>(`carts/${cartId}`).snapshotChanges();
  }

  // get the reference for the cart that will be use for adding, updating and deleting
   myCartRef() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      this.createCart();
      cartId = localStorage.getItem('cartId');
    }
    return this.db.collection<Cart>(`carts`).doc(cartId).ref;
  }

  // add product to cart
  addToCart(product, qty) {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef();
      ref.get().then(doc => {
        //get the cart data
        const cartData = doc.data();
        const imageData = [];
       this.productService.getProductImages(product.id).snapshotChanges().subscribe(image => {
       let number = 0;
         return image.map(file => {

            if (number == 0) {
              number++;
             // all the product on hte cart
             const productInCart = cartData.products;
             const productToCart = {
               id: product.id,
               name: product.name,
               quantity: qty,
               price: product.price,
               image: file.payload.doc.data()
             };
             const exist = ShoppingCartService.findProductByKey(productInCart, 'id', product.id);
             if (!exist) {
               productInCart.push(productToCart);
               cartData.totalProducts += qty;
             } else {
               exist.quantity += qty;
               cartData.totalProducts += qty;
             }

             return ref.update(cartData).then(() => {
              this.snackbarService.launch('Producto agregado', 'Carrito', 3000);
               resolve(true);
             }).catch((error) => {
               reject(error);
             });
            }

          });
        });


      });
    });
  }


  // this one is to know if the product exist on the cart using a key
  static findProductByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
    return null;
  }


  // to sum all the quantity of all the product that we have on our cart
  totalPrice(products: Product[]): number {
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += (parseInt(products[i]['quantity']) * products[i]['price']);
    }
    return total;
  }


  updateProduct(product, qty): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef();
      ref.get().then(doc => {
        const cartData = doc.data();
        const productsInCart = cartData.products;
        const exists = ShoppingCartService.findProductByKey(productsInCart, 'id', product.id);
        if (exists) {
          if (exists.quantity != qty) {
            exists.quantity = qty;
            cartData.totalProducts = ShoppingCartService.totalProductsInCart(cartData.products);
          }
          return ref.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        } else {
          this.addToCart(product, qty);
        }
      });
    });
  }

  // remove product from shoppingCart
  removeProduct(product): Promise<any> {
    return new Promise((resolve, reject) => {
      const ref = this.myCartRef();
      ref.get().then(doc => {
        const cartData = doc.data();
        const productsInCart = cartData.products;
        const totalQty = cartData.totalProducts;
        cartData.totalProducts = 0;
        const exists = ShoppingCartService.findProductByKey(productsInCart, 'id', product.id);
        if (exists) {
          const index = productsInCart.findIndex(obj => obj.id === product.id);
       
          if(exists.quantity){
            cartData.totalProducts = parseInt(totalQty) - parseInt(exists.quantity);
          }
         
          cartData.products = [
            ...productsInCart.slice(0, index),
            ...productsInCart.slice(index + 1)
          ];
          return ref.update(cartData).then(() => {
            resolve(true);
          }).catch((err) => {
            reject(err);
          });
        }
      });
    });
  }


  // clear the cart
  resetCart(): Promise<any> {
    const ref = this.myCartRef();
    return ref.get().then(doc => {
      const cartData = doc.data();
      cartData.products = [];
      cartData.totalProducts = 0;
      return ref.update(cartData);
    });
  }

      }



