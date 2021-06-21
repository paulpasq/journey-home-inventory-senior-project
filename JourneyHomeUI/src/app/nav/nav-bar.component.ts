import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../services';
import { IgxCsvExporterService } from "igniteui-angular";
import { NgbdExportModalComponent } from '../export-csv-modal/export-csv-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdChangeEmailComponent } from '../change-email-template/change-email-template.component';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

/* 
Handles the nav bar at the top of every page
*/

export class NavbarComponent implements OnInit {

  constructor(private router: Router, private modalService: NgbModal, private http: HttpClient, private loginService: LoginService, private csvExportService: IgxCsvExporterService) { }
  isAdmin = false

  // check if the user has admin privileges 
  ngOnInit() {
    let adminStatus = this.loginService.checkAdmin()
    if (adminStatus == true) {
      this.isAdmin = true
    }
  }

  logOut() {
    this.http.post('/api/user/logout', { withCredentials: true })
      .subscribe(
        resp => { },
        error => this.reportError(error),
        () => this.onComplete()
      )
  }

  reportError(error) {
    console.log(error)
  }

  onComplete() {
    this.loginService.destroySession()
    this.router.navigate(['/login'])
  }

  // opens the export CSV modal
  public csvExport() {
    const modalRef = this.modalService.open(NgbdExportModalComponent, { size: 'lg' })
    var modalResult
    modalRef.result.then((result) => {
    })
  }

  // opens the change email template modal
  public changeEmailSettings() {
    const modalRef = this.modalService.open(NgbdChangeEmailComponent, { size: 'lg' })
    var modalResult
    modalRef.result.then((result) => {
    })
  }

}