import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Product } from 'shared/models/products/product.model';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { ProductService } from 'shared/services/product/product.service';
import { Ventas } from 'shared/models/ventas/ventas.model';
import { VentasService } from 'shared/services/ventas/ventas.service';
import { NgForm } from '@angular/forms';
import * as faker from 'faker';
@Component({
  selector: 'app-registrar-ventas',
  templateUrl: './registrar-ventas.component.html',
  styleUrls: ['./registrar-ventas.component.css']
})
export class RegistrarVentasComponent implements OnInit {

  venta:Ventas;
  mainProductQuantity: number;
  filterTXb;
  // angular data table
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService,
    private snackbarService: SnackbarService, private ventasService:VentasService) {
    this.productService.getAll().valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }),
      (err) => {
        this.snackbarService.launch('Error obteniendo productos' + err.message, 'Productos', 4000);
      };
  }

  displayMatTable(){
    this.displayedColumns = ['name',  'price','quantity'];
  }

  applyFilter(filterValue: string) {
  
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
   
     // display mat table just when there is a value on the filter
     if(filterValue.length > 1){
      this.displayMatTable();
    } else {
      this.displayedColumns = null;
    }
  }



  // to track the table by the product id
  trackById(index, product: Product) {
    return product.id;
  }

  ngOnInit() {
   // get the reference of the cart
   const ventasRef= this.ventasService.getVentaCollectionRef().get();
   // verify if the cart exist
   ventasRef.then((item) => {
     if (item.exists) { // cart exist
       this.ventasService.getVentaCollection().subscribe(myVentas => { // get the values from the cart
        //  this.item = myCart.payload.data();
       });
     } else {// cart does not exist
       this.ventasService.create();
     }
   });
  }
  // agregar nuevo Producto
  addVenta(product: Product, form: NgForm) {
   // check if there is a product
    if(product){       
      // this.venta.id = faker.random.alphaNumeric(16); 
      this.venta = new Ventas();
      this.venta.productId = product.id;  
      this.venta.productName = product.name;
      this.venta.productQty = form.value.productQuantity;
      this.venta.price  = product.price;
      this.venta.productCost  = product.cost;
     this.ventasService.addToCart(this.venta);
    }

    this.mainProductQuantity = null;
    this.displayedColumns = null;
    this.filterTXb = null;
   }   

}


