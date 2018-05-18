import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { AppUser } from './../../auth/model/user.model';
import { CreateAdmin } from './../../auth/service/create-admin.service';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent  {

  makeAdmin:boolean;
  filterTXb;
  // angular data table
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private createAdmin: CreateAdmin) {
    this.createAdmin.getAllUsers().valueChanges().subscribe(data => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
      
  }

  displayMatTable(){
    this.displayedColumns = ['name',  'email', 'roles'];
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


  updateAdmin(event, user:AppUser){
    if (!confirm('Estas seguro/a que quieres cambiar el acceso de administrador?')) { return; }
    this.createAdmin.updateAdmin(user, event.checked);
 
  }

  updateManager(event, user:AppUser){
    if (!confirm('Estas seguro/a que quieres cambiar el acceso de vendedor?')) { return; }
    this.createAdmin.updateManager(user, event.checked);
      }

      updateCliente(event, user:AppUser){
        if (!confirm('Estas seguro/a que quieres cambiar el acceso del cliente?')) { return; }
        this.createAdmin.updateCliente(user, event.checked);
          }

}
