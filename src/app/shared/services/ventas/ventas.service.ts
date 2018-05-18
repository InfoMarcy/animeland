import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as faker from 'faker';

import { VentasCart } from 'shared/models/ventas/ventas-cart';
import { Ventas } from 'shared/models/ventas/ventas.model';
import { SnackbarService } from './../angular-material/snack-bar.service';

@Injectable()
export class VentasService {

 // inject angular firebase database
 constructor(private db: AngularFirestore, private snackbarService: SnackbarService) { }

 
      // this one is to know if the ventas exist on the cart using a key
 // this one is to know if the product exist on the cart using a key
 static findProductByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

  // this find the total products on the cart
  static grandTotalSoldCart(ventas: Ventas[]) {
    let sum = 0;
    for (let i = 0; i < ventas.length; i++) {
      sum += (ventas[i]['total']);
    }
    return sum;
  }

   // this find the total products on the cart
   static totalProductSold(ventas: Ventas[]) {
    let sum = 0;
    for (let i = 0; i < ventas.length; i++) {
      sum += (ventas[i]['productQty']);
    }
    return sum;
  }

  // create ventas collection
  create() {
    this.db.collection('ventasCart').doc("2Ky6Zj58Y83L49ZmUGy5").set(
      {
        dateCreated: new Date().getTime(),
        id: "2Ky6Zj58Y83L49ZmUGy5",
        Ventas: [],
        grandTotalSold: 0,
        totalProductsSold: 0,
        ganancias: 0
      }
    );
  }

 // get the ventasCart for the admin
 getVentaCollection() {
    return this.db.doc<VentasCart>(`ventasCart/2Ky6Zj58Y83L49ZmUGy5`).snapshotChanges();
  }

  // get the reference for the ventasCart that will be use for adding, updating and deleting
  getVentaCollectionRef() {
    return this.db.collection<VentasCart>(`ventasCart`).doc('2Ky6Zj58Y83L49ZmUGy5').ref;
  }

    // add product to cart
    addToCart(venta) {
      const ventasId = faker.random.alphaNumeric(16);
      venta.id = ventasId;
        return new Promise((resolve, reject) => {
          const ref = this.getVentaCollectionRef();
          ref.get().then(doc => {
                         // all the ventas to the cart
                //  const ventasInCart = ventasData.ventas;
                 const ventaToCart = {
                  productId: venta.productId,
                   productName: venta.productName,
                   productQty: venta.productQty,
                   price: venta.price,
                   total: (parseInt(venta.productQty) * parseInt(venta.price)),
                   productCost: venta.productCost,                  
                   created_at: venta.created_at
                 };
                 const ventasData = doc.data();
               
                 const ventasInCart = ventasData.Ventas;                 
                  const exist = VentasService.findProductByKey(ventasInCart, 'productId', venta.productId);
                  const sameDate = VentasService.findProductByKey(ventasInCart, 'created_at', venta.created_at);
                 console.log(sameDate);
                
                  if (!exist) {               
                    ventasInCart.push(ventaToCart);
                    ventasData.grandTotalSold += (venta.productQty * venta.price);
                    ventasData.ganancias += ((venta.price - venta.productCost ) * venta.productQty);
                    ventasData.totalProductsSold += venta.productQty;
                    this.snackbarService.launch("venta agregada", "Venta", 5000);                    
                                    
                 } else if(exist && (!sameDate.created_at == venta.created_at)) {           
                   exist.productQty += venta.productQty;                  
                   ventasData.totalProductsSold += venta.productQty;
                   ventasData.ganancias += ((venta.price - venta.productCost) * venta.productQty);
                   this.snackbarService.launch("venta agregada", "Venta", 5000);  
                 } else if(exist && (sameDate.created_at == venta.created_at)) {
                  ventasInCart.push(ventaToCart);
                    ventasData.grandTotalSold += (venta.productQty * venta.price);
                    ventasData.ganancias += ((venta.price - venta.productCost ) * venta.productQty);
                    ventasData.totalProductsSold += venta.productQty;
                    this.snackbarService.launch("venta agregada", "Venta", 5000);  
                 }
    
                 return ref.update(ventasData).then(() => {
                   resolve(true);
                 }).catch((error) => {
                   reject(error);
                 });
                });
    
             
            });
    
    
        
      }
   

      // get the grand total of all the ventas for the day
      getTotalPrice(ventas: Ventas[]): number{
        let total = 0;
        for (let i = 0; i < ventas.length; i++) {
          total += (ventas[i]['productQty'] * ventas[i]['price']);
        }
        return total;
      }

        // get the total number of products sold in the day
        getTotalProductQty(ventas: Ventas[]): number{
          let total = 0;
          for (let i = 0; i < ventas.length; i++) {
            total += (ventas[i]['productQty']);
          }
          return total;
        }


            // get the ganancias for the day
            getGanancia(ventas: Ventas[]): number{
              let total = 0;
              for (let i = 0; i < ventas.length; i++) {
                total += ((ventas[i]['price'] - ventas[i]['productCost']) * ventas[i]['productQty']);
              }
              return total;
            }

           


}