import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableService, DDonator } from '../services';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-edit-donor',
  templateUrl: './edit-donor.component.html',
  styleUrls: ['./edit-donor.component.css'],
  providers: [DataTableService]
})

/*
This handles the edit donor modal
takes in the selected donor ID
submitting will edit the selected donor in the DB
*/

export class EditDonorComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  donators: DDonator[] = []

  @Input() DonatorID
  myForm: FormGroup
  donatorData: DDonator
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  submitted = false;

  constructor(private tableService: DataTableService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.dataTableService.getDonator(this.DonatorID)
      .subscribe(data => {
        this.donatorData = data[0]

        // Email and Phone were causing validation errors in the 
        // backend when they iniialized the formcontrol as null
        // initialPhone and initialEmail are used as a workaround
        var initialPhone;
        if (this.donatorData.Phone == null) {
          initialPhone = '';
        }
        else {
          initialPhone = this.donatorData.Phone;
        }

        var initialEmail;

        if (this.donatorData.Email == null) {
          initialEmail = '';
        }
        else {
          initialEmail = this.donatorData.Email;
        }

        this.myForm = this.formBuilder.group({
          donatorName: new FormControl(this.donatorData.Name, [Validators.required]),
          donatorEmail: new FormControl(initialEmail),
          donatorPhone: new FormControl(initialPhone, [Validators.minLength(10), Validators.maxLength(14)]),
          donatorTown: new FormControl(this.donatorData.Town),
          donatorID: new FormControl(this.donatorData.DonatorID)
        })
      })
  }

  get donatorName() { return this.myForm.get('donatorName'); }
  get donatorEmail() { return this.myForm.get('donatorEmail'); }
  get donatorPhone() { return this.myForm.get('donatorPhone'); }
  get donatorTown() { return this.myForm.get('donatorTown'); }
  get donatorID() { return this.myForm.get('donatorID'); }

  submitForm() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }


    var response
    this.dataTableService.patchDonator(this.DonatorID, this.myForm.value.donatorName, this.myForm.value.donatorEmail, this.myForm.value.donatorPhone, this.myForm.value.donatorTown)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}
