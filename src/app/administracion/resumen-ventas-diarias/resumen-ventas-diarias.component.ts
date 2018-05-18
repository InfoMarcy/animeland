import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Product } from 'shared/models/products/product.model';
import { FechasModel } from 'shared/models/ventas/fechas-model';
import { VentasService } from 'shared/services/ventas/ventas.service';
import { AuthService } from 'auth/service/auth.service';

@Component({
  selector: 'app-resumen-ventas-diarias',
  templateUrl: './resumen-ventas-diarias.component.html',
  styleUrls: ['./resumen-ventas-diarias.component.css']
})
export class ResumenVentasDiariasComponent{

  fechasModel = new FechasModel();
  // resumen de ventas
  ventas;
  _ventas;
 grandTotalSold: number;
 totalProductsSold: number;
 ganacias:number;
 pipe;
 date = new Date(); 
 picker = ((this.date.getMonth()+1) +'/'+  this.date.getDate() + '/' +  this.date.getFullYear()); 
  
 
 // angular data table
  displayedColumns = ['name',  'price','quantity', 'total'];
  dataSource: MatTableDataSource<any>;
  appUser;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ventasService:VentasService, private auth: AuthService) {

        // check if there is a user loggedin
        this.auth.user$.subscribe(appUser => { this.appUser = appUser; });

    console.log("picker " + this.picker );
    // get the reference of the cart
   const ventasRef= this.ventasService.getVentaCollectionRef().get();
   // verify if the vemtas exist
   ventasRef.then((item) => {
     if (item.exists) { // cart exist
       this.ventasService.getVentaCollection().subscribe(myVentas => { // get the values from the cart
       this._ventas = myVentas.payload.data();
         // filter ventas by date
    
       
       this.ventas = this._ventas.Ventas.filter(
        p => p.created_at === this.picker);

     
       // get the total of this attributes for the resumen
      this.grandTotalSold = this.ventasService.getTotalPrice(this.ventas);
      this.totalProductsSold = this.ventasService.getTotalProductQty(this.ventas);
      this.ganacias = this.ventasService.getGanancia(this.ventas);
      
// pass the values to the data table
       this.dataSource = new MatTableDataSource(this.ventas);
         this.dataSource.sort = this.sort;
         this.dataSource.paginator = this.paginator;
      });
     } 
   }); 
  }

  applyFilter(filterValue: string) {
  
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // to track the table by the product id
  trackById(index, product: Product) {
    return product.id;
  }

  changeDate(event){
    this.pipe = new DatePipe('en-US'); // Use your own locale
    const myFormattedDate = this.pipe.transform(event, 'M/d/yyyy');
    this.picker = myFormattedDate; 

    this.ventas = this._ventas.Ventas.filter(
      p => p.created_at === myFormattedDate);

     // get the total of this attributes for the resumen
    this.grandTotalSold = this.ventasService.getTotalPrice(this.ventas);
    this.totalProductsSold = this.ventasService.getTotalProductQty(this.ventas);
    this.ganacias = this.ventasService.getGanancia(this.ventas);
    
// pass the values to the data table
     this.dataSource = new MatTableDataSource(this.ventas);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
}

getResumenVentas(model: FechasModel){
  this.pipe = new DatePipe('en-US'); // Use your own locale
  const desde = this.pipe.transform(model.desde, 'M/d/yyyy');
  const hasta = this.pipe.transform(model.hasta, 'M/d/yyyy');
    this.ventas = this._ventas.Ventas.filter(
    p => p.created_at >= desde && p.created_at <= hasta);

   // get the total of this attributes for the resumen
  this.grandTotalSold = this.ventasService.getTotalPrice(this.ventas);
  this.totalProductsSold = this.ventasService.getTotalProductQty(this.ventas);
  this.ganacias = this.ventasService.getGanancia(this.ventas);
  
// pass the values to the data table
   this.dataSource = new MatTableDataSource(this.ventas);
     this.dataSource.sort = this.sort;
     this.dataSource.paginator = this.paginator;
}
}