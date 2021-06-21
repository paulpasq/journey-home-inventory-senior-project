import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DataTableService, UUser } from '../services';
import { ForgotPasswordComponent } from '../forgot_password'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-edit-management',
  templateUrl: './edit-management.component.html',
  styleUrls: ['./edit-management.component.css'],
  providers: [DataTableService]
})

/* 
Handles the edit user modal
takes in the userID 
on submit will edit the user in the DB
*/

export class EditManagementComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  users: UUser[] = []

  @Input() user_id
  myForm: FormGroup
  userData: UUser
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  submitted = false;

  constructor(private tableService: DataTableService, public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private dataTableService: DataTableService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.dataTableService.getUser(this.user_id)
      .subscribe(data => {

        this.userData = data[0]

        this.myForm = this.formBuilder.group({
          useremail: new FormControl(this.userData.Email, [Validators.required]),
          is_Admin: new FormControl(this.userData.IsAdmin, [Validators.required]),
          userid: new FormControl(this.userData.UserID, [Validators.required])
        })
      })
  }

  get useremail() { return this.myForm.get('useremail'); }
  get is_Admin() { return this.myForm.get('is_Admin'); }
  get userid() { return this.myForm.get('userid'); }

  passreset(user_id) {
    this.activeModal.close()
    const modalRef = this.modalService.open(ForgotPasswordComponent, { size: 'md' })
    modalRef.componentInstance.user_id = user_id

    var modalResult
    modalRef.result.then((result) => {
      modalResult = result

      if (modalResult != undefined) {
        this.users = []

        this.tableService.getUsers()
          .subscribe(users => {
            this.users = users;
            this.dtTrigger.next();
          });
      }
    })
  }


  submitForm() {
    this.submitted = true;
    if (this.myForm.invalid) {
      return;
    }
    var response

    this.dataTableService.patchUser(this.user_id, this.myForm.value.useremail, this.myForm.value.is_Admin)
      .subscribe(data => {
        response = data
        this.activeModal.close(response)
      })
  }
}
