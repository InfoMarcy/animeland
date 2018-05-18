import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { SnackbarService } from './../angular-material/snack-bar.service';

@Injectable()
export class InventoryService {

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



  // create ventas collection
  create() {
    this.db.collection('inventory').doc("2Ky6Zj58Y83L49ZmUGy5").set(
      {
        dateCreated: new Date().getTime(),
        id: "2Ky6Zj58Y83L49ZmUGy5",
        products: []
      }
    );
  }

 // get the ventasCart for the admin
 getInventoryCollection() {
    return this.db.doc(`inventory/2Ky6Zj58Y83L49ZmUGy5`).snapshotChanges();
  }

  // get the reference for the ventasCart that will be use for adding, updating and deleting
  getInventoryCollectionRef() {
    return this.db.collection(`inventory`).doc('2Ky6Zj58Y83L49ZmUGy5').ref;
  }

    // add product to cart
    addToInventory(product, inventoryQty?) {

        return new Promise((resolve, reject) => {
          const ref = this.getInventoryCollectionRef();
          ref.get().then(doc => {
                         // all the ventas to the cart
         
                 const productToInventory = {
                   productId: product.id,
                   productName: product.name,
                   productQty: product.stock_quantity,
                   productCost: product.cost,
                   created_at: new Date().getTime()
                 };
                 // inventory data
                 const productData = doc.data();
                 // products in enventory               
                 const productInInventory = productData.products;   
                 // checck if the product exist              
                  const exist = InventoryService.findProductByKey(productInInventory, 'productId', product.id);
                  //check if the product has the same data
                  const sameCost = InventoryService.findProductByKey(productInInventory, 'productCost', product.cost);
               
                // if not exist add it
                  if (!exist) {               
                    productInInventory.push(productToInventory);                                   
                                    
                 } else if(exist && (!sameCost)) { // if exist and dont have the same cost add new record
                    productToInventory.productQty = inventoryQty;
                    productInInventory.push(productToInventory);           
                
                 } else if(exist && (sameCost.productCost == product.cost)) {// if exist and has the same cost update the qty
                    exist.productQty = 0;
                    exist.productQty = parseInt(product.stock_quantity) + parseInt( exist.productQty);
                 }
    
                 // return the result
                 return ref.update(productData).then(() => {
                   resolve(true);
                 }).catch((error) => {
                   reject(error);
                 });
                });
    
             
            });
    
    
        
      }

}