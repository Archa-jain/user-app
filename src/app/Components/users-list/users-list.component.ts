import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { UserData } from "../../models/user-data.model";
import { UsersService } from '../../Services/users.service';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {

  displayedColumns = ['name', 'email', 'age', 'type', 'status', 'action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subscriptions = new Subscription();
  constructor(
    private router: Router,
    private usersService : UsersService,
    private dialog : MatDialog
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.usersService.getUsers().subscribe( users => {
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(users);
      this.setTableSortingDataAccessor();
    }));

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  redirectToNewUser(){
    this.router.navigate(['/new-user']);
  }

  editUser(event){
    console.log(event);
    this.router.navigate(['/user',event.id]);
  }

  deleteUser(event){
      let dialogRef = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        height :'auto'
      });

      this.subscriptions.add(dialogRef.afterClosed().subscribe(result => {
          console.log("after dialog");
          if( result ) {
            this.subscriptions.add(this.usersService.deleteUser(event.id).subscribe( users => {
              this.dataSource = new MatTableDataSource(users);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.setTableSortingDataAccessor();
            }));
          }

      }));
    }

    setTableSortingDataAccessor(){
      this.dataSource.sortingDataAccessor = ( item, property) => {
        switch(property) {
          case 'type':
                        return item.plan.type;
          case 'status':
                        return item.plan.status;
          default:
                        return item[property];
        }
      }
    }




}
