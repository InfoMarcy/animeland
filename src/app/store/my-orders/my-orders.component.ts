
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../auth/service/auth.service';
import { Order } from 'shared/models/orders/order.model';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { OrderService } from 'shared/services/checkout/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnDestroy {



// angular data table
displayedColumns: string[] =  ['id', 'created_at', 'customer', 'amount', 'totalProducts', 'detail'];
dataSource: MatTableDataSource<any>;
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;
userSubscription: Subscription;

constructor(private orderService: OrderService,
              private auth: AuthService,
            private snackbarService: SnackbarService) {
            this.userSubscription =   this.auth.user$.subscribe(user => {
              if (user) {
                this.orderService.getOrderByUserId(user.uid).valueChanges().subscribe(data => {
                  this.dataSource = new MatTableDataSource(data);
                  this.dataSource.sort = this.sort;
                  this.dataSource.paginator = this.paginator;
                }, err => {
                  this.snackbarService.launch('Error obteniendo Pedidos' + err.message, 'Pedidos', 5000);
                }
              );
              }

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
    this.userSubscription.unsubscribe();
  }
}


