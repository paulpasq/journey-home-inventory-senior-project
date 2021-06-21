import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})

/*
this handles the add user modal accessed from the user management page
on submit it will push the new user to the DB
*/

export class AddUserComponent implements OnInit {
  myForm: FormGroup
  submitted = false;


  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      admin: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  get email() { return this.myForm.get('email'); }
  get admin() { return this.myForm.get('admin'); }
  get password() { return this.myForm.get('password'); }


  submitForm() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    var response
    this.dataTableService.createUser(this.myForm.value.email, this.myForm.value.admin, this.myForm.value.password)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}
