import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableService } from '../services';




@Component({
  selector: 'ngbd-ChangeEmailComponent',
  templateUrl: './change-email-template.component.html',
  styleUrls: ['./change-email-template.component.css']
})

/*
This handles the change email template accessible from the options menu on the nav bar. 
It is only visible to admins.
There must be some email data already saved in the DB for this to work.
submitting will edit the email template saved in the DB
*/


export class NgbdChangeEmailComponent implements OnInit {
  emailBody: string
  emailHeader: string
  myForm: FormGroup
  submitted = false

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
  }

  ngOnInit() {
    this.dataTableService.getEmail()
      .subscribe(data => {
        this.emailBody = data[0].EmailBody
        this.emailHeader = data[0].EmailHeader

        this.myForm = this.formBuilder.group({
          EmailHeader: new FormControl(data[0].EmailHeader, [Validators.maxLength(60), Validators.required]),
          EmailBody: new FormControl(data[0].EmailBody, [Validators.maxLength(2000), Validators.required]),
        })
      })
  }

  get EmailBody() { return this.myForm.get('EmailBody'); }
  get EmailHeader() { return this.myForm.get('EmailHeader'); }

  submitForm() {
    this.submitted = true

    if (this.myForm.invalid) {
      return;
    }


    var response
    this.dataTableService.patchEmail(this.myForm.value.EmailHeader, this.myForm.value.EmailBody)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}