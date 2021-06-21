import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableService, IInventory } from '../services';

// change date format
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
    selector: 'ngbd-donateModalComponent',
    templateUrl: './donate-inventory-modal.component.html',
    styleUrls: ['./donate-inventory-modal.component.css']
})

/*
 This takes in a donation ID
 when submitted it will create an archive record as well a patch or delete the original item 
 */


export class NgbdDonateModalComponent implements OnInit {
    @Input() donation_id
    myForm: FormGroup
    itemData: IInventory
    emailHeader: string
    emailBody: string
    submitted = false;
    originalQuantity;

    constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
    }

    ngOnInit() {
        this.dataTableService.getItem(this.donation_id)
            .subscribe(data => {
                this.itemData = data[0]
                this.dataTableService.getDonator(this.itemData.DonatorID)
                    .subscribe(donatorData => {
                        this.originalQuantity = this.itemData.Quantity
                        this.itemData.Donator = donatorData[0];

                        this.myForm = this.formBuilder.group({
                            donorEmail: new FormControl(''),
                            donorPhone: new FormControl(''),
                            donorName: new FormControl(''),
                            dateDonated: new FormControl('', [Validators.required]),
                            itemQuantity: new FormControl(this.itemData.Quantity, [Validators.required])
                        })
                    })
            })

        // prepare the email body and header
        this.dataTableService.getEmail()
            .subscribe(data => {
                this.emailBody = data[0].EmailBody
                this.emailHeader = data[0].EmailHeader
            })
    }

    get dateDonated() { return this.myForm.get('dateDonated'); }
    get itemQuantity() { return this.myForm.get('itemQuantity'); }

    // tied to the plus button to increase quantity input box
    addItem() {
        var quantity = this.myForm.get('itemQuantity').value;
        quantity++
        if (quantity > this.itemData.Quantity) {
            quantity = this.itemData.Quantity
        }
        this.myForm.patchValue({
            itemQuantity: quantity
        })
    }

    // tied to the minus button to decrease quantity input box
    removeItem() {
        var quantity = this.myForm.get('itemQuantity').value;
        quantity--
        if (quantity <= 0) {
            quantity = 0
        }
        this.myForm.patchValue({
            itemQuantity: quantity
        })
    }

    // if the donor has an email, open the users email app with the email template populated
    sendEmail() {
        if (this.itemData.Donator.Email) {
            //Replaces all placeholder variables the client has written in;
            //For example, Hello #DN will replace with Hello Matt or whatever
            var body = this.emailBody
            body = body.replace(/(#DN)/g, this.itemData.Donator.Name.toString())
            body = body.replace(/(#IN)/g, this.itemData.Name.toString())
            body = body.replace(/(#PC)/g, this.itemData.PrimaryCategory.toString())
            body = body.replace(/(#SC)/g, this.itemData.SecondaryCategory.toString())
            body = body.replace(/(#DR)/g, this.itemData.DateRecieved.toString())


            var header = this.emailHeader
            header = header.replace(/(#DN)/g, this.itemData.Donator.Name.toString())
            header = header.replace(/(#IN)/g, this.itemData.Name.toString())
            header = header.replace(/(#PC)/g, this.itemData.PrimaryCategory.toString())
            header = header.replace(/(#SC)/g, this.itemData.SecondaryCategory.toString())
            header = header.replace(/(#DR)/g, this.itemData.DateRecieved.toString())


            body = body.replace(/\n/g, '%0D%0A')
            var mailText = "mailto:" + this.itemData.Donator.Email + "?subject=" + header + "&body=" + body
            window.location.href = mailText;
        }
        else {
            //Do nothing if there is no email associated with selected donor
            alert("There is no email associated with this item.")
            return
        }

    }

    submitForm() {
        this.submitted = true;

        //Number of items selected for donation = 0
        if (this.myForm.get('itemQuantity').value == this.originalQuantity) {
            alert("New quantity must be less than original quantity");
            return;
        }

        // Check to make sure date donated is after date recieved
        var newdate = this.myForm.get('dateDonated').value
        newdate = new Date(newdate.year, newdate.month - 1, newdate.day);
        var date2 = new Date(this.itemData.DateRecieved);
        if (newdate < date2) {
            alert("Date donated must be after date recieved!")
            return
        }

        // if invalid, cancel
        if (this.myForm.invalid) {
            return;
        }

        var response
        var date = this.myForm.value.dateDonated
        var jsDate
        var formattedDate
        if (date != "") {

            jsDate = new Date(date.year, date.month - 1, date.day)
            formattedDate = formatDate(jsDate)

            //QuantityDonated is the amount of item that was removed
            var quantityDonated = this.originalQuantity - this.myForm.get('itemQuantity').value;
            this.itemData.Quantity = quantityDonated
            this.itemData.DateDonated = formattedDate

            // We check if there is any of the original item remaining, if not, delete original, if so, lower the quantity
            if (quantityDonated == this.originalQuantity) //Everything was donated
            {
                // delete original item entry
                this.dataTableService.deleteRow(this.itemData.DonationID, true)
                    .subscribe(data => {
                        response = data
                    })
            }
            else {
                // edit exsting item's quantity 
                this.dataTableService.patchItem(this.itemData.DonationID, false, this.itemData.Name, this.itemData.DonatorID, null, this.itemData.DateRecieved, this.itemData.Condition, (this.originalQuantity - quantityDonated), null)

                    .subscribe(data => {
                        response = data
                    })
            }

            let jsonValues = JSON.stringify(this.itemData)

            // make new entry in archives with specified data 
            this.dataTableService.archiveItem(jsonValues, this.itemData.DonatorID)
                .then(data => {
                    response = data
                    this.activeModal.close(response)
                })
        }
    }
}