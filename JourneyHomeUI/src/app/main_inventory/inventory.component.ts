import { DDonator } from './../services/donator-model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableService, IInventory } from '../services/index'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdEditModalComponent } from '../edit_inventory';
import { NgbdDonateModalComponent } from '../donate-inventory-modal/donate-inventory-modal.component';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

/*
This page handles the main inventory screen in all its forms
Current, archives, counts, and photos

*/


// I dont think this ever gets used
export function flatten(inventory: any) {
  return Object.keys(inventory).reduce((acc, current) => {
    const _key = `${current}`;
    const currentValue = inventory[current];
    if (Array.isArray(currentValue) || Object(currentValue) === currentValue) {
      Object.assign(acc, flatten(currentValue));
    } else {
      acc[_key] = currentValue;
    }
    return acc;
  }, {});
};

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styles: ['./inventory.component.css'],
  providers: [DataTableService]
})


export class InventoryComponent implements OnDestroy, OnInit {

  dtOptions: DataTables.Settings = {};

  baseUrl = environment.baseUrl;
  urlString: string = ""
  donatorData: DDonator[] = []
  inventoryCounts: any[]
  inventory: IInventory[]
  archive: IInventory[]
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  currentInventoryState: string;
  loadOneComplete: boolean
  loadTwoComplete: boolean




  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tableService: DataTableService, private modalService: NgbModal) { }






  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      this.currentInventoryState = params.get('location')
    });
    this.dtOptions[0] = {
      paging: true,
      searching: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };
    this.dtOptions[1] = {
      paging: true,
      searching: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      destroy: true
    };

    this.refreshInventory()

  }


  showCounts() {
    this.currentInventoryState = 'counts'
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next()
    })
  }

  showMainInventory() {
    this.currentInventoryState = 'main'
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next()
    })
  }

  showPhotoInventory() {
    this.currentInventoryState = 'photos'
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next()
    })
  }


  showArchive() {
    this.currentInventoryState = 'archive'
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.dtTrigger.next()
    })
  }

  deleteRow(index, donation_id) {
    this.tableService.deleteRow(donation_id).subscribe((success) => {
      this.inventory = []
      this.loadOneComplete = false
      this.loadTwoComplete = false
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();

        this.refreshInventory();
      })
    })
  }





  refreshInventory() {
    this.loadOneComplete = false
    this.loadTwoComplete = false
    this.inventory = []
    this.inventoryCounts = []
    this.archive = []

    this.tableService.getItems()
      .subscribe(items => {

        this.tableService.getDonators()
          .subscribe(listOfDonators => {

            this.donatorData = listOfDonators



            items.forEach(element => {
              if (element.Photo)
                element.Photo = this.baseUrl + "/images/" + element.Photo

              this.donatorData.forEach(done => {

                if (done.DonatorID == element.DonatorID) {
                  element.Donator = done;

                  if (element.Archived) {
                    this.archive.push(element);
                  } else {
                    this.inventory.push(element);
                  }

                }
                else if (done.DonatorID == null) {
                }

              })
            });
            this.loadOneComplete = true

          })

      });

    this.tableService.getItemCounts()
      .subscribe(data => {
        this.inventoryCounts = data
        this.loadTwoComplete = true
      })

  }



  donateItem(donation_id) {
    const modalRef = this.modalService.open(NgbdDonateModalComponent, { size: 'lg' })
    modalRef.componentInstance.donation_id = donation_id

    var modalResult
    modalRef.result.then((result) => {
      modalResult = result
      this.refreshInventory()
      if (modalResult != undefined) {
        this.inventory = []
        this.loadOneComplete = false
        this.loadTwoComplete = false
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })

        this.refreshInventory()
      }
    })
  }


  editItem(donation_id) {
    const modalRef = this.modalService.open(NgbdEditModalComponent, { size: 'lg' })
    modalRef.componentInstance.donation_id = donation_id

    var modalResult
    modalRef.result.then((result) => {
      modalResult = result
      if (modalResult != undefined) {
        this.inventory = []
        this.loadOneComplete = false
        this.loadTwoComplete = false
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        })

        this.refreshInventory()
      }
    })
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

}