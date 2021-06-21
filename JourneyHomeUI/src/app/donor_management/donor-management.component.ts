import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableService, DDonator } from '../services/index'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDonorComponent } from '../add_donor'
import { EditDonorComponent } from '../edit_donor_modal';

@Component({
  selector: 'app-donor-management',
  templateUrl: './donor-management.component.html',
  styleUrls: [],
  providers: [DataTableService]
})

/* 
this is the donor management page that the route goes to
it displays all donors and gives the ability to edit / delete them
*/
export class DonorManagementComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};
  donators: DDonator[]
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

    this.donators = []

    // retrieve all donors 
    this.tableService.getDonators()
      .subscribe(donators => {
        this.donators = donators;
        this.dtTrigger.next()
      });
  }

  // opens the add donor modal
  createDonator() {
    const modalRef = this.modalService.open(AddDonorComponent, { size: 'md' })
    var modalResult
    modalRef.result.then((result) => {
      modalResult = result
      if (modalResult != undefined) {
        this.donators = []

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })
        this.tableService.getDonators()
          .subscribe(donators => {
            this.donators = donators;
            this.dtTrigger.next();
          });
      }
    })
  }

  // remove a donor from the DB
  // any items from that donor will be set to "*No Donor*"
  deleteDonator(index, donator_id) {
    this.tableService.deleteDonator(donator_id).subscribe(
      (success) => {
        this.donators = []
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();

          this.tableService.getDonators()
            .subscribe(donators => {
              this.donators = donators
              // Call the dtTrigger to rerender again
              this.dtTrigger.next();
            });
        })
      }
    )
  }

  // edit existing donor in DB
  editDonator(DonatorID) {
    const modalRef = this.modalService.open(EditDonorComponent, { size: 'md' })
    modalRef.componentInstance.DonatorID = DonatorID

    var modalResult
    modalRef.result.then((result) => {
      modalResult = result

      if (modalResult != undefined) {
        this.donators = []

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })
        this.tableService.getDonators()
          .subscribe(donators => {
            this.donators = donators;
            this.dtTrigger.next();
          });
      }
    })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}