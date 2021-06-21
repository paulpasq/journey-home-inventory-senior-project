import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { InventoryAppComponent } from './inventory-app.component';
import { NavbarComponent } from './nav/nav-bar.component';
import { InventoryComponent } from './main_inventory/index';
import { DataTableService, ItemDataService, LoginService, OnlyLoggedInUsersGuard } from './services/index';
import { AddInventoryComponent } from './add_inventory/index';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { UserManagementComponent } from '../app/user_management';
import { DonorManagementComponent } from '../app/donor_management';
import { NgbdEditModalComponent } from './edit_inventory';
import { EditManagementComponent } from './edit_management';
import { AddUserComponent } from './add_user';
import { AddDonorComponent } from './add_donor';
import { ForgotPasswordComponent } from './forgot_password';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field'
import { IgxCsvExporterService } from "igniteui-angular";
import { EditDonorComponent } from './edit_donor_modal';
import { NgbdDonateModalComponent } from './donate-inventory-modal/donate-inventory-modal.component';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';
import { NgbdExportModalComponent } from './export-csv-modal/export-csv-modal.component';
import { MatCheckboxModule } from '@angular/material';
import { ChartsComponent } from './charts/charts.component';
import { TotalCountsChartComponent } from './total-counts-chart/total-counts-chart.component';
import { ChartsModule } from 'ng2-charts';
import { TwinBedChartComponent } from './twin-bed-chart/twin-bed-chart.component';
import { FullBedChartComponent } from './full-bed-chart/full-bed-chart.component';
import { QueenBedChartComponent } from './queen-bed-chart/queen-bed-chart.component';
import { HoldTimeChartComponent } from './hold-time-chart/hold-time-chart.component';
import { MatSelectModule } from '@angular/material';
import { DonationChartComponent } from './donation-chart/donation-chart.component';
import { NgbdChangeEmailComponent } from './change-email-template/change-email-template.component';

@NgModule({
  declarations: [
    InventoryAppComponent,
    NavbarComponent,
    InventoryComponent,
    AddInventoryComponent,
    UserManagementComponent,
    DonorManagementComponent,
    EditDonorComponent,
    NgbdEditModalComponent,
    NgbdDonateModalComponent,
    EditManagementComponent,
    LoginComponent,
    AddUserComponent,
    ForgotPasswordComponent,
    AddDonorComponent,
    ForgotPasswordComponent,
    AddDonorComponent,
    ForgotPasswordComponent,
    NgbdExportModalComponent,
    NgbdChangeEmailComponent,
    ChartsComponent,
    TotalCountsChartComponent,
    TwinBedChartComponent,
    FullBedChartComponent,
    QueenBedChartComponent,
    HoldTimeChartComponent,
    DonationChartComponent,
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    NgbModule,
    HttpClientModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    BrowserModule,
    NgbModule,
    MatCheckboxModule,
    ChartsModule,
    MatSelectModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },  // <-- add this
    DataTableService,
    ItemDataService,
    LoginService,
    OnlyLoggedInUsersGuard,
    IgxCsvExporterService
  ],
  exports: [
    NgbdEditModalComponent,
    NgbdDonateModalComponent,
    NgbdExportModalComponent,
    NgbdChangeEmailComponent,
    EditManagementComponent,
    EditDonorComponent,
    AddUserComponent,
    AddDonorComponent,
    ForgotPasswordComponent,
  ],
  entryComponents: [
    NgbdEditModalComponent,
    NgbdDonateModalComponent,
    NgbdExportModalComponent,
    NgbdChangeEmailComponent,
    EditManagementComponent,
    EditDonorComponent,
    AddUserComponent,
    AddDonorComponent,
    ForgotPasswordComponent
  ],
  bootstrap: [InventoryAppComponent]
})
export class AppModule {
}
