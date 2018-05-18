import { SubCategories } from 'shared/models/subcategories.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';

import { Product } from 'shared/models/products/product.model';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { CategoryService } from 'shared/services/product/category.service';
import { ProductService } from 'shared/services/product/product.service';
import { Upload } from 'shared/models/products/product-images.model';
import { UploadService } from 'shared/services/product/upload.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {

  uploads;
  categories;
  _categories;
  subcategories;
  stock_location = [
    { id: 'Multiplaza Santin', location: 'Multiplaza Santin'},
    { id: 'Plaza de la Tecnologia', location: 'Plaza de la Tecnologia'}
  ];

  constructor(private db: AngularFirestore,
            public dialogRef: MatDialogRef<ProductDialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: Product,
            private snackbarService: SnackbarService,
            private productService: ProductService,
            private uploadService: UploadService,
            private categoryService: CategoryService) {

              //get the images of the selected product
              if (data.id) {
                this.uploads = this.productService.getById(this.data.id).collection(`uploads`).snapshotChanges().map(actions => {
                  return actions.map(upload => {
                    const data = upload.payload.doc.data();
                    const id = upload.payload.doc.id;
                    return {id, ...data};
                  });
                });
              }
             }

  ngOnInit() {
    this.getCategories();
  }

  // add or update a product
  saveProduct() {
    //if it has an id update
    if (this.data.id) { // update product
this.productService.update(this.data).then(() => {
   this.snackbarService.launch('Producto Actualizado', 'Tienda', 4000); })
   .catch(error => { this.snackbarService.launch('Error' + error.message, 'Tienda', 4000); });
    } else { //add new product
this.productService.save(this.data).then(() => {
  this.snackbarService.launch('Producto Creado', 'Tienda', 4000); })
  .catch(error => { this.snackbarService.launch('Error' + error.message, 'Tienda', 4000); });
    }
 
      //close the dialog window
      this.dialogRef.close();
  }


  getCategories() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });

  }

  removeUpload(upload: Upload) {
this.uploadService.removeFile(upload.id).then(() => {
  this.db.doc(`products/${this.data.id}/uploads/${upload.id}`).delete().then(() => {
    this.snackbarService.launch('Adjunto Eliminado', 'Tienda', 4000);
  }).catch(error => {
    this.snackbarService.launch('Error ' + error.message, 'Tienda', 4000);
  });
});
  }

}
