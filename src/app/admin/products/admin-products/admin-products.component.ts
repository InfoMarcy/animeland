import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'auth/service/auth.service';

import { Product } from 'shared/models/products/product.model';
import { InventoryService } from 'shared/services/inventory/inventory.service';
import { ProductService } from 'shared/services/product/product.service';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent  implements OnInit{
  // angular data table
  displayedColumns: string[] =  ['name', 'description', 'price', 'category', 'stock_quantity','update', 'action', 'edit', 'delete'];
  dataSource: MatTableDataSource<any>;
  appUser;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService,private auth: AuthService, 
               public dialog: MatDialog,   private inventoryService: InventoryService,
              private snackbarService: SnackbarService) {
this.getProducts();
   }
ngOnInit(){
    // get the reference of the inventory
    const inventoryRef= this.inventoryService.getInventoryCollectionRef().get();
    console.log("inventory on init" + inventoryRef);
    // verify if the inventory exist
    inventoryRef.then((item) => {
      if (!item.exists) { // inventory exist
       this.inventoryService.create();
      }
    });
}

   // get the list of products
   getProducts(){
    this.productService.getAll().valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    
        // check if there is a user loggedin
        this.auth.user$.subscribe(appUser => { this.appUser = appUser; });
    }),
    (err) => {
       this.snackbarService.launch('Error obteniendo productos' + err.message, 'Productos', 4000);
    };
   }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  openDialog(product) {
    this.dialog.open(ProductDialogComponent, AdminProductsComponent.dialogConfig(product));
  }


  // to track the table by the product id
  trackById(index, product: Product) {
    return product.id;
  }

  // agregar nuevo Producto
  addProduct() {
    const product: Product = new Product;
    this.dialog.open(ProductDialogComponent, AdminProductsComponent.dialogConfig(product));
  }


  private static dialogConfig(data): MatDialogConfig {
    const config: MatDialogConfig = new MatDialogConfig;
    config.width = '700px';
    config.maxHeight = '700px';
    config.data = data;
    return config;
  }

  //delete a product and its images from db
  remove(product: Product) {
    if (!confirm('Estas seguro/a que quieres borrar este producto?')) { return; }
this.productService.delete(product.id).then(() => {
  this.snackbarService.launch('Producto eliminado correctamente', 'Productos', 5000);
});
  }

  editState;
  productToEdit;
  productToInventory: Product = {
    id: "",
    name: "",
    price: 0,
    stock_quantity: null
  };
  // update the inventory quantity
  edit(product) {
this.editState = true;
 this.productToEdit = product;

  }

  clearState() {
    this.editState = false;
    this.productToEdit = null;
    this.getProducts();
    
  }

  updateProductInventoryQty(product, inventoryQty){
 
this.productService.updateProductInventoryQtyById(product, inventoryQty.stockQuantity);
this.productToInventory.stock_quantity = null;
this.clearState();
}
}
