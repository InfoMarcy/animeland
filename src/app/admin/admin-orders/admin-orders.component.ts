import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { OrderService } from 'shared/services/checkout/order.service';
import { Order } from 'shared/models/orders/order.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnDestroy {
  // angular data table
  displayedColumns: string[] =  ['id', 'created_at', 'customer', 'amount', 'totalProducts', 'detail'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  orderSubscription: Subscription;

  constructor(private orderService: OrderService,
              private snackbarService: SnackbarService) {
               this.orderSubscription =   this.orderService.getOrders().valueChanges().subscribe(data => {
                    this.dataSource = new MatTableDataSource(data);
                    this.dataSource.sort = this.sort;
                    this.dataSource.paginator = this.paginator;
                  }, err => {
                    this.snackbarService.launch('Error obteniendo Pedidos' + err.message, 'Pedidos', 5000);
                  });

            }


   // search by fields
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

    // to track the table by the product id
    trackById(index, order: Order) {
      return order.id;
    }

ngOnDestroy() {
  this.orderSubscription.unsubscribe();
}
}
