import { Injectable } from '@angular/core';
import { IInventory } from './datatable.model'
import { Observable, of } from 'rxjs';
import { ItemDataService } from '../services/itemdata.service'
import { Router } from '@angular/router';
import { UUser } from './user-model'
import { DDonator } from './donator-model';

@Injectable({ providedIn: 'root' })
export class DataTableService {

  constructor(private router: Router, private itemDataService: ItemDataService) {
  }

  getItems(): Observable<IInventory[]> {
    return this.itemDataService.loadItems()
  }

  getItem(DonationID): Observable<IInventory> {
    return this.itemDataService.loadItem(DonationID)
  }

  getItemCounts(): Observable<any> {
    return this.itemDataService.loadItemCounts()
  }

  getAllCategory(PrimaryCategory): Observable<IInventory> {
    return this.itemDataService.loadAllCategory(PrimaryCategory)
  }

  getUsers(): Observable<UUser[]> {
    return this.itemDataService.loadUsers()
  }

  getUser(UserID): Observable<UUser> {
    return this.itemDataService.loadUser(UserID)
  }

  patchItem(DonationID, deletePhoto, DonationName, DonatorID, DateDonated, DateRecieved, Condition, Quantity, Photo): Observable<IInventory> {
    return this.itemDataService.patchItem(DonationID, deletePhoto, DonationName, DonatorID, DateDonated, DateRecieved, Condition, Quantity, Photo)
  }

  async archiveItem(items, donatorID) {
    var parsedItems = JSON.parse(items)
    if (await this.itemDataService.archiveItem(donatorID, parsedItems.DateRecieved, parsedItems) === true) {
      this.router.navigate(['/inventory','main'])
    }
  }

  patchDonator(DonatorID, donator_name, donator_email, donator_phone, donator_town): Observable<DDonator> {
    return this.itemDataService.patchDonator(DonatorID, donator_name, donator_email, donator_phone, donator_town)
  }

  patchUser(UserID, Email, IsAdmin): Observable<UUser> {
    return this.itemDataService.patchUser(UserID, Email, IsAdmin)
  }

  patchUserPass(UserID, Password): Observable<UUser> {
    return this.itemDataService.patchUserPass(UserID, Password)
  }

  patchItemWithoutDonation(DonationID, Condition, PrimaryCategory, Quantity): Observable<IInventory> {
    return this.itemDataService.patchItemWithoutDonation(DonationID, Condition, PrimaryCategory, Quantity)
  }

  getDonator(donatorID): Observable<DDonator> {
    return this.itemDataService.loadDonator(donatorID)
  }

  patchEmail(EmailHeader, EmailBody): Observable<any> {
    return this.itemDataService.patchEmail(EmailHeader, EmailBody)
  }


  getEmail(): Observable<any> {
    return this.itemDataService.getEmail()
  }

  getDonators(): Observable<DDonator[]> {
    return this.itemDataService.loadDonators()
  }

  createDonator(Email, Name, Phone, Town): Observable<any> {
    return this.itemDataService.createDonator(Email, Name, Phone, Town)
  }

  createUser(Email, IsAdmin, Password): Observable<any> {
    return this.itemDataService.createUser(Email, IsAdmin, Password)
  }

  async createItems(items, searchResult, Photo: any[], Archived: false) {
    var parsedItems = JSON.parse(items)
    if (await this.itemDataService.createItem(searchResult, parsedItems.date_received, parsedItems.items, Photo, Archived) === true) {
      this.router.navigate(['/inventory','main'])
    }
  }

  async createItemsWithNewDonor(items, searchResult, Photo) {
    var parsedItems = JSON.parse(items)
    if (await this.itemDataService.createItem(searchResult.DonatorID, parsedItems.DateRecieved, Photo, parsedItems.items) === true) {
      this.router.navigate(['/inventory','main'])
    }

  }

  deleteRow(DonationID, skipConfirm = false): Observable<any> {
    if (skipConfirm || confirm("Are you sure you want to delete this item?")) {
      return this.itemDataService.deleteRow(DonationID).pipe();
    }
  }

  deleteUser(UserID): Observable<any> {
    if (confirm("Are you sure you want to delete this user?")) {
      return this.itemDataService.deleteUser(UserID).pipe();
    }
  }

  deleteDonator(DonatorID): Observable<any> {
    if (confirm("Are you sure you want to delete this donator?")) {
      return this.itemDataService.deleteDonator(DonatorID).pipe();
    }
  }


}
