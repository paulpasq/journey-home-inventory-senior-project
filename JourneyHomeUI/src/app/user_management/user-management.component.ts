import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableService, UUser } from '../services/index'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditManagementComponent } from '../edit_management';
import { AddUserComponent } from '../add_user'


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: [],
  providers: [DataTableService]
})

/* 
This is the user management page that the route goes to
it displays all users and gives the ability to edit / delete them
*/

export class UserManagementComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  users: UUser[]
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  loadComplete: boolean

  constructor(private tableService: DataTableService, private modalService: NgbModal) { }

  ngOnInit() {
    this.dtOptions = {
      paging: true,
      searching: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };

    this.users = []

    this.tableService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.dtTrigger.next()
      });
  }

  // opens the add user modal
  createUser() {
    const modalRef = this.modalService.open(AddUserComponent, { size: 'md' })
    var modalResult
    modalRef.result.then((result) => {
      modalResult = result
      if (modalResult != undefined) {
        this.users = []

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })
        this.tableService.getUsers()
          .subscribe(users => {
            this.users = users;
            this.dtTrigger.next();
          });
      }
    })
  }


  deleteUser(index, user_id) {
    this.tableService.deleteUser(user_id).subscribe((success) => {
      this.users = []

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {

        // Destroy the table first
        dtInstance.destroy();

        this.tableService.getUsers()
          .subscribe(users => {
            this.users = users
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
      })
    })
  }

  // opens the edit user modal
  editUser(user_id) {
    const modalRef = this.modalService.open(EditManagementComponent, { size: 'md' })
    modalRef.componentInstance.user_id = user_id

    var modalResult
    modalRef.result.then((result) => {
      modalResult = result
      if (modalResult != undefined) {
        this.users = []

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })
        this.tableService.getUsers()
          .subscribe(users => {
            this.users = users;
            this.dtTrigger.next();
          });
      }
    })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}