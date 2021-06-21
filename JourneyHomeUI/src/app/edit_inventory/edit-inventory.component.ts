import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableService, DDonator, IInventory } from '../services';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { environment } from '../../environments/environment';


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

@Component({
    selector: 'ngbd-editInventory',
    templateUrl: './edit-inventory.component.html',
    styleUrls: ['./edit-inventory.component.css']
})

/* 
this handles the edit inventory modal
takes in the donationID
does not enable the user to edit the categories
on submit will update the item in the DB
*/

export class NgbdEditModalComponent implements OnInit {

    @Input() donation_id
    myForm: FormGroup;
    itemData: IInventory;
    submitted = false;
    donorSelected: DDonator = new DDonator(); //For dropdown
    filteredDonators: DDonator[] = []
    donatorData: DDonator[] = []
    results: string[]; //For dropdown
    itemPhoto = '';
    baseUrl = environment.baseUrl;
    newPhoto: File;
    url: any
    deletePhoto: boolean = false
    constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
    }

    ngOnInit() {
        this.refreshDonators();

        //get selected item from DB
        this.dataTableService.getItem(this.donation_id)
            .subscribe(data => {
                this.itemData = data[0]
                // item photo comes in as a file name.
                // use that name to create a link to the file
                if (this.itemData.Photo) {
                    this.itemData.Photo = this.baseUrl + "/images/" + this.itemData.Photo
                }

                this.dataTableService.getDonator(this.itemData.DonatorID)
                    .subscribe(donatorData => {
                        this.itemData.Donator = donatorData[0];
                        var dReceived = new Date(this.itemData.DateRecieved)

                        var ngbReceived = { day: dReceived.getUTCDate(), month: dReceived.getUTCMonth() + 1, year: dReceived.getUTCFullYear() }
                        var ngbDonated

                        this.donorSelected = donatorData[0]

                        if (this.itemData.DateDonated != undefined) {
                            var dDonated = new Date(this.itemData.DateDonated)
                            ngbDonated = { day: dDonated.getUTCDate(), month: dDonated.getUTCMonth() + 1, year: dDonated.getUTCFullYear() }
                        }
                        else {
                            ngbDonated = null
                        }

                        //Only require date donated if the item is archived
                        if (this.itemData.Archived == true) {
                            this.myForm = this.formBuilder.group({
                                itemName: new FormControl(this.itemData.Name, Validators.required),
                                dateReceived: new FormControl(ngbReceived, [Validators.required]),
                                dateDonated: new FormControl(ngbDonated, [Validators.required]),
                                Condition: new FormControl(this.itemData.Condition, [Validators.required]),
                                itemQuantity: new FormControl(this.itemData.Quantity, [Validators.max(100), Validators.min(1), Validators.required]),
                                donorDropdown: new FormControl('', [Validators.required]),
                                PhotoString: new FormControl('')
                            })
                        }
                        else {
                            this.myForm = this.formBuilder.group({
                                itemName: new FormControl(this.itemData.Name, Validators.required),
                                dateReceived: new FormControl(ngbReceived, [Validators.required]),
                                dateDonated: new FormControl(ngbDonated),
                                Condition: new FormControl(this.itemData.Condition, [Validators.required]),
                                itemQuantity: new FormControl(this.itemData.Quantity, [Validators.max(100), Validators.min(1), Validators.required]),
                                donorDropdown: new FormControl('', [Validators.required]),
                                PhotoString: new FormControl('')
                            })
                        }
                    })

            })

    }

    get itemName() { return this.myForm.get('itemName'); }
    get dateDonated() { return this.myForm.get('dateDonated'); }
    get dateReceived() { return this.myForm.get('dateReceived'); }
    get itemCondition() { return this.myForm.get('itemCondition'); }
    get itemQuantity() { return this.myForm.get('itemQuantity'); }
    get PhotoString() { return this.myForm.get('PhotoString'); }


    submitForm() {
        this.submitted = true;

        //Check to make sure all required fields have been filled out
        if (this.myForm.invalid) {
            return;
        }

        var response
        var dateDonated = this.myForm.value.dateDonated
        var dateReceived = this.myForm.value.dateReceived
        var jsDate
        var formattedDateDonated
        var formattedDateReceived

        if (dateDonated != null) {
            jsDate = new Date(dateDonated.year, dateDonated.month - 1, dateDonated.day)
            formattedDateDonated = formatDate(jsDate)
        }

        jsDate = new Date(dateReceived.year, dateReceived.month - 1, dateReceived.day)
        formattedDateReceived = formatDate(jsDate)

        // we use the delete photo boolean to specify if the photo in the DB should be overwritten. 
        // If false it keeps the original photo
        // the API only accepts a file for photo
        this.dataTableService.patchItem(this.donation_id, this.deletePhoto, this.myForm.value.itemName, this.donorSelected.DonatorID, formattedDateDonated, formattedDateReceived, this.myForm.value.Condition, this.myForm.value.itemQuantity, this.newPhoto)
            .subscribe(data => {
                response = data
                this.activeModal.close(response)
            })
    }

    // possibly required for donor dropdown
    // onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    //     this.donatorData.some(element => {
    //         if (element.Email === event.option.value) {
    //             let capitalName = element.Name.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })
    //             this.myForm.patchValue({
    //                 donorName: capitalName
    //             })
    //         }
    //     })
    // }



    // search and handledropdown are used for donor complete dropdown
    // searches the donator array and updates the contents of the dropdown 
    // based on ther parameters entered by the user
    search(event) {
        let filtered: DDonator[] = [];
        let query = event.query;

        for (let i = 0; i < this.donatorData.length; i++) {
            let curDonator = this.donatorData[i];

            //curDonator.Name = curDonator.Name.charAt(0).toUpperCase() + curDonator.Name.substr(1).toLowerCase();

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

    // get donator data 
    refreshDonators() {
        this.dataTableService.getDonators().subscribe((data: any) => {
            this.donatorData = data
        })
    }


    handleFileInput(files: FileList) {
        var reader = new FileReader();
        this.newPhoto = files.item(0)
        reader.readAsDataURL(files.item(0)); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
            this.url = reader.result;
        }
        this.deletePhoto = true

    }

    removePhoto() {
        this.deletePhoto = true
        this.newPhoto = null
        this.itemData.Photo = null
        document.getElementById("Photo").attributes.item(0).value = '';
    }

}