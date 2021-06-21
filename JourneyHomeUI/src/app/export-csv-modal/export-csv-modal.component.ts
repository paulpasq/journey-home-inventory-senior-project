import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataTableService, IInventory } from '../services';
import { MAT_CHECKBOX_CLICK_ACTION } from '@angular/material';
import { flatten } from '../main_inventory';
import { CsvFileTypes, IgxCsvExporterOptions, IgxCsvExporterService } from 'igniteui-angular';



function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }


  return [year, month, day].join('-');
}

providers: [{ provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check' }]

@Component({
  selector: 'ngbd-exportModalComponent',
  templateUrl: './export-csv-modal.component.html',
  styleUrls: ['./export-csv-modal.component.css']
})

/*
Handles the export CSV modal
on submit will export the selected data to a csv file
*/

export class NgbdExportModalComponent implements OnInit {

  @Input() donation_id
  myForm: FormGroup
  itemData: IInventory
  allItems: IInventory[]
  DonationID: String
  Archived: Boolean
  Current: String
  Name: String
  PrimaryCategory: String
  SecondaryCategory: String
  Quantity: String
  Tag: String
  Condition: String
  DateRecieved: String
  DateDonated: String
  DonatorID: String
  exportCategories: string[]

  // Instantiate all check boxes as false
  DonationIDChecked: boolean = false
  NameChecked: boolean = false
  PrimaryCategoryChecked: boolean = false
  SecondaryCategoryChecked: boolean = false
  ArchivedChecked: boolean = false
  CurrentChecked: boolean = false
  DonatorIDChecked: boolean = false
  QuantityChecked: boolean = false
  TagChecked: boolean = false
  ConditionChecked: boolean = false
  DateDonatedChecked: boolean = false
  DateRecievedChecked: boolean = false
  SelectAllChecked: boolean = false

  constructor(private csvExportService: IgxCsvExporterService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
  }

  ngOnInit() {
    this.exportCategories = []

    //Extract all items from the database and store in "allItems"
    this.dataTableService.getItems()
      .subscribe(items => {
        this.allItems = items
      });

    //Set everything to false
    this.myForm = this.formBuilder.group({
      DonationID: new FormControl(false),
      Name: new FormControl(false),
      PrimaryCategory: new FormControl(false),
      SecondaryCategory: new FormControl(false),
      Archived: new FormControl(false),
      Current: new FormControl(false),
      DonatorID: new FormControl(false),
      Quantity: new FormControl(false),
      Tag: new FormControl(false),
      Condition: new FormControl(false),
      DateDonated: new FormControl(false),
      DateRecieved: new FormControl(false),
      SelectAll: new FormControl(false)
    })

    this.selectAll()

  }

  get dateDonated() { return this.myForm.get('dateDonated'); }
  get itemQuantity() { return this.myForm.get('itemQuantity'); }



  //Function that slects all toggles all the check boxes.
  //Called when the select all checkbox is hit
  selectAll() {
    //Select everything if checked
    if (this.SelectAllChecked) {
      this.DonationIDChecked = true
      this.NameChecked = true
      this.PrimaryCategoryChecked = true
      this.SecondaryCategoryChecked = true
      this.ArchivedChecked = true
      this.CurrentChecked = true
      this.DonatorIDChecked = true
      this.QuantityChecked = true
      this.TagChecked = true
      this.ConditionChecked = true
      this.DateDonatedChecked = true
      this.DateRecievedChecked = true
    }
    //Deselect everything if unchecked
    else {
      this.DonationIDChecked = false
      this.NameChecked = false
      this.PrimaryCategoryChecked = false
      this.SecondaryCategoryChecked = false
      this.ArchivedChecked = false
      this.CurrentChecked = false
      this.DonatorIDChecked = false
      this.QuantityChecked = false
      this.TagChecked = false
      this.ConditionChecked = false
      this.DateDonatedChecked = false
      this.DateRecievedChecked = false
    }

  }


  submitForm() {
    var archived = false
    var current = false
    this.exportCategories = []

    // loop through all form controls
    Object.keys(this.myForm.controls).forEach(key => {

      //if it is checked then add it's key to exportCategories string array
      if (this.myForm.get(key).value == true) {
        if (key == "Archived") {
          archived = true
          this.exportCategories.push(key)
        } else
          if (key == "Current") {
            current = true
          } else {
            this.exportCategories.push(key)
          }
      }
    })

    //If neither archived or current is checked, send warning
    if (archived == false && current == false) {
      alert("Must select at least one of {archived , current}")
      return;
    }

    this.getRequestedData(archived, current, this.exportCategories)
  }

  // 
  getRequestedData(archivedRequested: boolean, currentRequested: boolean, categoryArray: string[]) {

    var exportData: any[] = []


    if (currentRequested) {
      //loop through all items to see which ones are not archived
      this.allItems.forEach(item => {

        let temp: any = {}

        if (item.Archived == false) {
          categoryArray.forEach(category => {
            switch (category) {
              case "Name": {
                temp.Name = item.Name
                break;
              }

              case "Archived": {
                temp.Archived = item.Archived
                break;
              }

              case "Quantity": {
                temp.Quantity = item.Quantity
                break;
              }
              case "Tag": {
                temp.Tag = item.Tag
                break;
              }
              case "Condition": {
                temp.Condition = item.Condition
                break;
              }
              case "PrimaryCategory": {
                temp.PrimaryCategory = item.PrimaryCategory
                break;
              }
              case "SecondaryCategory": {
                temp.SecondaryCategory = item.SecondaryCategory
                break;
              }
              case "DateRecieved": {
                temp.DateRecieved = item.DateRecieved
                break;
              }
              case "DateDonated": {
                temp.DateDonated = item.DateDonated
                break;
              }
              case "DonationID": {
                temp.DonationID = item.DonationID
                break;
              }
              case "DonatorID": {
                temp.DonatorID = item.DonatorID
                break;
              }
              default: {
                break;
              }

            }
          })

          var flattenitem = flatten(temp)
          exportData.push(flattenitem)
        }
      })
    }

    if (archivedRequested) {
      //loop through all items to see which ones are not archived
      this.allItems.forEach(item => {

        let temp: any = {}

        if (item.Archived == true) {
          categoryArray.forEach(category => {
            switch (category) {
              case "Name": {
                temp.Name = item.Name
                break;
              }

              case "Archived": {
                if (currentRequested) {
                  temp.Archived = item.Archived
                }
                break;
              }

              case "Quantity": {
                temp.Quantity = item.Quantity
                break;
              }
              case "Tag": {
                temp.Tag = item.Tag
                break;
              }
              case "Condition": {
                temp.Condition = item.Condition
                break;
              }
              case "PrimaryCategory": {
                temp.PrimaryCategory = item.PrimaryCategory
                break;
              }
              case "SecondaryCategory": {
                temp.SecondaryCategory = item.SecondaryCategory
                break;
              }
              case "DateRecieved": {
                temp.DateRecieved = item.DateRecieved
                break;
              }
              case "DateDonated": {
                temp.DateDonated = item.DateDonated
                break;
              }
              case "DonationID": {
                temp.DonationID = item.DonationID
                break;
              }
              case "DonatorID": {
                temp.DonatorID = item.DonatorID
                break;
              }
              default: {
                break;
              }

            }
          })

          var flattenitem = flatten(temp)
          exportData.push(flattenitem)
        }
      })
    }

    var fileName = "Report"
    if (archivedRequested && currentRequested) {
      fileName = "Full Report"
    } else if (archivedRequested) {
      fileName = "Archive Report"
    } else if (currentRequested) {
      fileName = "Inventory Report"
    }

    const opt: IgxCsvExporterOptions = new IgxCsvExporterOptions(fileName, CsvFileTypes.CSV);
    this.csvExportService.exportData(exportData, opt);
  }

}
