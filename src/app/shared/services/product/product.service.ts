import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as faker from 'faker';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { expand, mergeMap, take, takeWhile } from 'rxjs/operators';

import { Product } from 'shared/models/products/product.model';
import { SnackbarService } from '../angular-material/snack-bar.service';
import { InventoryService } from '../inventory/inventory.service';
import { UploadService } from './upload.service';

  // for working with firebase firestore collection
  type productCollection = AngularFirestoreCollection<Product[]>;
  // get the reference for the document id for delete and getById or Update
  type productDoc = AngularFirestoreDocument<Product>;

@Injectable()
export class ProductService {
     // inject angular firebase database
     constructor(private db: AngularFirestore, 
      private uploadService: UploadService,
      private inventoryService: InventoryService, 
      private snackbarService :SnackbarService){

      }

    // retreave the list of products from firestore
     getAll(): productCollection {
       return this.db.collection<Product[]>('products');
     }
      // get product By id
      getById(id: string): productDoc {
     return this.db.doc<Product>(`products/${id}`);
      }

      getProductById(id: string){
        return this.db.collection<Product>('products').doc(id)
        .ref.get()
        .then(function(doc) {
          if (doc.exists) {
            return doc.data();
          } else {
              console.log("No such document!");
          }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      }

      //update a product in firebase
      update(product): Promise<any> {
        return this.getById(product.id).update(
          Object.assign({}, product));
      }

       // add a product to firebase
       save(product: Product): Promise<any> {
        product.id = faker.random.alphaNumeric(16);
        // add product to inventory
        this.inventoryService.addToInventory(product);
        return this.getAll().doc(product.id).set(
          Object.assign({}, product));
      }


      getProductImages(productId: string) {
        return this.db.doc<Product>(`products/${productId}`).collection('uploads');
      }

        // delete a product from firebase and all its images and call a batch delete
        delete(productId): Promise<any> {
          const ref = this.getById(productId);
         const result =  new Promise((resolve, reject) => {
           this.deleteUploadsCollection(`products/${productId}/uploads`, 1).subscribe(() => {
              ref.delete().then(() => {
                resolve(true);
              }).catch(error => {
                reject(error);
              });
            });
          });

          if(this.getById(productId) != null){
            this.db.doc<Product>(`products/${productId}`).delete()
          }
          return result;
        }

        // for batch delete
        private deleteUploadsCollection(path: string, limit: number): Observable<any> {
          const source = this.deleteBatch(path, limit);
        // delete it the product has an image
            return source.pipe(
              expand(val => this.deleteBatch(path, limit)),
              takeWhile(val => val > 0)
            );
             
        }

        // batch delete
        private deleteBatch(path: string, limit: number): Observable<any> {
          const ref = this.db.collection(path, ref => ref.orderBy('__name__').limit(limit));
          
          return ref.snapshotChanges().pipe(
            take(1),
            mergeMap(snapshot => {
              const batch = this.db.firestore.batch();
              snapshot.forEach(doc => {
           
                this.uploadService.removeFile(doc.payload.doc.id);
                batch.delete(doc.payload.doc.ref);
              });
              return fromPromise(batch.commit()).map(() => snapshot.length);
            })
          );
        }


          // get the reference for the ventasCart that will be use for adding, updating and deleting
  getProductCollectionRef(id) {

    return this.db.collection<Product>(`products`).doc(id).ref;
  }


  // update Product Inventory Qty By Id 
  updateProductInventoryQtyById(product, inventoryQty){

    return new Promise((resolve, reject) => {
      const ref = this.getProductCollectionRef(product.id);
      ref.get().then(doc => {      
            
             const getProduct = doc.data();
              if(product.id != null) {             
                getProduct.stock_quantity = (parseInt(getProduct.stock_quantity) + parseInt(inventoryQty));
                console.log(getProduct);
                 this.inventoryService.addToInventory(getProduct, inventoryQty);
                 this.snackbarService.launch(inventoryQty + " " + product.name +  " han sido añadidas", "Inventario", 5000);  
             }

             return ref.update(getProduct).then(() => {
               resolve(true);
             }).catch((error) => {
               reject(error);
             });
            });

         
        });


    
  }


}
