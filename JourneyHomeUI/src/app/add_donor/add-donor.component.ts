import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-donor',
  templateUrl: './add-donor.component.html',
  styleUrls: ['./add-donor.component.css'],
})

/* 
This handles the modal that pops up when the green "add donor" button is pressed. 
the user will be prompted to enter the donor details.
it then return the created donor as a response.
*/
export class AddDonorComponent implements OnInit {
  myForm: FormGroup
  submitted = false;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl(''),
      phone: new FormControl('', [Validators.minLength(10), Validators.maxLength(14)]),
      town: new FormControl(''),
    })
  }

  get name() { return this.myForm.get('name'); }
  get email() { return this.myForm.get('email'); }
  get phone() { return this.myForm.get('phone'); }
  get town() { return this.myForm.get('town'); }

  submitForm() {

    //having submitted set to true will trigger the input error display if the form is invalid
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    var response

    this.dataTableService.createDonator(this.myForm.value.email, this.myForm.value.name, this.myForm.value.phone, this.myForm.value.town)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}
