import { Component, OnInit, Input } from '@angular/core';
import { DataTableService, UUser } from '../services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

/*
handles the reset password modal
*/
export class ForgotPasswordComponent implements OnInit {

  @Input() user_id
  myForm: FormGroup
  userData: UUser
  submitted = false;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService) {
  }

  ngOnInit() {
    this.dataTableService.getUser(this.user_id)
      .subscribe(data => {

        this.userData = data[0]

        this.myForm = this.formBuilder.group({
          userid: new FormControl(this.userData.UserID),
          pass: new FormControl('', Validators.required),
          confirmpass: new FormControl('', Validators.required),
        }, { validator: this.MustMatch('pass', 'confirmpass') });
      })
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  get f() { return this.myForm.controls; }

  resetpassword() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    var response
    this.dataTableService.patchUserPass(this.user_id, this.myForm.value.pass)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}