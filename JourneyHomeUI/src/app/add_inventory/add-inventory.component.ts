import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableService, IInventory } from '../services';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DDonator } from '../services/donator-model';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { AddDonorComponent } from '../add_donor'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css'],
  providers: [DataTableService, DecimalPipe]
})

/* 
This is the page that displays when the user navigated to the add inventory route 
When complete it triggers the API call to add the items to the database and redirect
the client to the main inventory page.
*/


export class AddInventoryComponent implements OnInit {

  showErrorMessage: Boolean
  dynamicForm: FormGroup
  category: IInventory[] = []
  numberOfItems = 0
  submitted = false;
  flgAddCategory: boolean = false;
  donatorEmails: string[] = []
  donatorNames: string[] = []
  donatorData: DDonator[] = []
  donorSelected: DDonator = new DDonator(); //For dropdown
  filteredDonators: DDonator[] = []
  results: string[]; //For dropdown
  Pic: File[] = [];
  x: FormControl = new FormControl('None');

  selectedPrimaryCategory: string = "None";
  primaryCategories: string[] = ["Kitchen", "Living Room", "Bedroom", "Office"];
  currentSecondaryCategory: string[] = [];

  fileToUpload: File = null;

  filteredOptions: Observable<string[]>;

  imgString: String;

  constructor(private modalService: NgbModal, private router: Router, private tableService: DataTableService, private formBuilder: FormBuilder) {
    this.tableService.getDonators().subscribe((data: any) => {
      this.donatorData = data
      this.donatorData.forEach(element => {
        this.donatorEmails.push(element.Email)
      });
    })
  }




  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      date_received: new FormControl('', Validators.required),
      items: new FormArray([])
    })

    this.addItem();
    this.refreshDonators();
  }

  get date_received() { return this.dynamicForm.get('date_received'); }
  get Quantity() { return this.itemArray.get('Quantity') as FormArray; }
  get PrimaryCategory() { return this.itemArray.get('PrimaryCategory') as FormArray; }
  get SecondaryCategory() { return this.itemArray.get('SecondaryCategory') as FormArray; }
  get Condition() { return this.itemArray.get('Condition') as FormArray; }
  get Name() { return this.itemArray.get('Name') as FormArray; }
  get form() { return this.dynamicForm.controls }
  get itemArray() { return this.form.items as FormArray }
  get Photo() { return this.itemArray.get('Photo') as FormArray; }


  // adds a new item input row
  addItem() {
    this.itemArray.push(this.formBuilder.group({
      Condition: new FormControl('', Validators.required),
      PrimaryCategory: new FormControl('', Validators.required),
      SecondaryCategory: new FormControl('', Validators.required),
      Quantity: new FormControl('1', [Validators.max(100), Validators.min(1), Validators.required]),
      Name: new FormControl('', Validators.required),
      Photo: new FormControl(''),
      PhotoString: new String()

    }))

    this.numberOfItems = this.numberOfItems + 1;

    // we need to expand the pic array so we can properly set the image at 'position'
    // this will possibly be replaced by the file input if it is entered 
    this.Pic.push(null);
  }


  // removes the last item input row
  removeItem() {
    if (this.numberOfItems > 1) {
      let i = this.itemArray.length - 1
      this.itemArray.removeAt(i)
      this.numberOfItems = this.numberOfItems - 1
      this.Pic[i] = null;
    }
  }

  // 
  refreshDonators() {
    this.tableService.getDonators().subscribe((data: any) => {
      this.donatorData = data
      this.donatorData.forEach(element => {
        //Auto populate the dropdown and donorSelected with "*No Donor*" 
        //This is used if the donor is unknown
        if (element.DonatorID == 0 && element.Name == "*No Donor*") {
          this.donorSelected = element;
        }
      });
    })
  }

  // I dont think this is ever called? 
  // the following might be required by dropdown in some way

  // onSelectionChanged(event: MatAutocompleteSelectedEvent) {
  //   this.donatorData.some(element => {
  //     if (element.Email === event.option.value) {
  //       let capitalName = element.Name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
  //       this.dynamicForm.patchValue({
  //         donorName: capitalName
  //       })
  //     }
  //   })
  // }


  // Submit the item to DB
  saveItem() {
    if (!this.donorSelected) {
      alert("You must make a donor selection!")
    }

    if (this.numberOfItems == 0) {
      this.showErrorMessage = true
    }
    else {
      this.showErrorMessage = false
      this.submitted = true;

      if (this.dynamicForm.invalid) {
        console.log("Error Saving Item");
        return;
      }

      var date = this.dynamicForm.value.date_received
      var jsDate = new Date(date.year, date.month - 1, date.day)
      var formattedDate = formatDate(jsDate)
      this.dynamicForm.value.date_received = formattedDate
      let jsonValues = JSON.stringify(this.dynamicForm.value)

      this.tableService.createItems(jsonValues, this.donorSelected.DonatorID, this.Pic, false) //Replace 0 with ID of donator selected from populated dropdown

    }

  }


  createDonator() {
    const modalRef = this.modalService.open(AddDonorComponent, { size: 'md' })
    modalRef.result.then((result) => {
      this.refreshDonators();
    })
  }

  cancel() {
    this.router.navigate(['/inventory', 'main'])
  }

  selectChangeHandler(event: any, index: number) {
    var x = new String("ddddd ggggggg");
    x = x.replace(" ", "+");
    this.itemArray.at(index).get('SecondaryCategory').setValue("None");
    var date = this.dynamicForm.value.date_received;
    var jsDate = new Date(date.year, date.month - 1, date.day);
    var formattedDate = formatDate(jsDate);
    let jsonValues = JSON.stringify(this.dynamicForm.value)

  }


  handleFileInput(files: FileList, index: number) {
    this.fileToUpload = files.item(0);
    this.Pic[index] = files.item(0);
    var reader = new FileReader();
    reader.readAsDataURL(this.fileToUpload);
    reader.onloadend = () => {
      var base64data = reader.result;
      this.imgString = <String>base64data;
    }
  }

  // search and handledropdown are used for donor complete dropdown
  // searches the donator array and updates the contents of the dropdown 
  // based on ther parameters entered by the user
  search(event) {
    let filtered: DDonator[] = [];
    let query = event.query;

    for (let i = 0; i < this.donatorData.length; i++) {
      let curDonator = this.donatorData[i];


      if (curDonator.Name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(curDonator);
      }
    }

    // sort donator array by name in alphabetical order
    filtered = filtered.sort((a, b) => {
      return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
    });

    this.filteredDonators = filtered;

  }

}

