import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IInventory } from './datatable.model';
import { catchError} from 'rxjs/operators';
import { UUser } from './user-model'
import { DDonator } from './donator-model'
@Injectable()
export class ItemDataService {

    constructor(private http: HttpClient) { }

    loadItems(): Observable<IInventory[]> {
        return this.http.get<IInventory[]>('/api/donation')
            .pipe(catchError(this.handleError<IInventory[]>('loadItems', [])))
    }

    loadItem(donation_id): Observable<IInventory> {
        return this.http.get<IInventory>('/api/donation?DonationID=' + donation_id)
            .pipe(catchError(this.handleError<IInventory>('loadItem')))
    }

    loadItemCounts(): Observable<any> {
        return this.http.get<any>('/api/donation/count')
            .pipe(catchError(this.handleError<any>('loadItemCounts')))
    }

    loadAllCategory(item_type): Observable<IInventory> {
        return this.http.get<IInventory>('/api/donation/column?attribute=' + item_type)
            .pipe(catchError(this.handleError<IInventory>('loadCategory')))
    }

    deleteRow(donation_id) {
        return this.http.delete('/api/donation?DonationID=' + donation_id);
    }
    getEmail(): Observable<any> {
        return this.http.get('/api/donation/settings')
    }

    //we probably don't need this
    loadDonator(donatorID): Observable<any> {
        return this.http.get('/api/donator?DonatorID=' + donatorID)
    }

    loadDonators(): Observable<DDonator[]> {
        return this.http.get<DDonator[]>('/api/donator')
            .pipe(catchError(this.handleError<DDonator[]>('loadDonators', [])))
    }

    loadUsers(): Observable<UUser[]> {
        return this.http.get<UUser[]>('/api/user')
            .pipe(catchError(this.handleError<UUser[]>('loadUsers', [])))
    }

    loadUser(user_id): Observable<UUser> {
        return this.http.get<UUser>('/api/user?UserID=' + user_id)
            .pipe(catchError(this.handleError<UUser>('loadUser')))
    }

    deleteUser(user_id) {
        return this.http.delete('/api/user?UserID=' + user_id);
    }

    deleteDonator(DonatorID) {
        return this.http.delete('/api/donator?DonatorID=' + DonatorID);
    }



    createDonator(donator_email, donator_name, donator_phone, donator_town): Observable<any> {
        const params = new HttpParams({
            fromObject: {
                Name: donator_name,
                Email: donator_email,
                Phone: donator_phone,
                Town: donator_town,
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        return this.http.post('/api/donator', params, httpOptions)
            .pipe(catchError(this.handleError('createDonor')))
    }

    async createItem(donator_id, dateReceived, parsedItems, Photo: any[], Archived = false): Promise<boolean> {
        var finished = false
        var i = 0;
        for (var item of parsedItems) {
            var itemCondition = item.Condition
            var primaryCategory = item.PrimaryCategory
            var secondaryCategory = item.SecondaryCategory
            var itemquantity = item.Quantity
            var name = item.Name



            const params = new HttpParams({
                fromObject: {
                    DonatorID: donator_id,
                    DateRecieved: dateReceived,
                    Condition: itemCondition,
                    PrimaryCategory: primaryCategory,
                    SecondaryCategory: secondaryCategory,
                    Quantity: itemquantity,
                    Name: name,
                }
            })
            let formData = new FormData();
            if(Photo[i] != null)
            {
                formData.append('upload', Photo[i]);
            }
            i++;
            const httpOptions = {
                params: params,
                reportProgress: true,
            }

        
            await this.http.post('/api/donation?Archived=' + Archived, formData, httpOptions).pipe(catchError(this.handleError('createItem'))).toPromise()
        };
        

        return finished = true
    }

    createUser(useremail, is_Admin, pass): Observable<UUser> {
        const params = new HttpParams({
            fromObject: {
                Email: useremail,
                IsAdmin: is_Admin,
                Password: pass
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        return this.http.post<UUser>('/api/user/register', params, httpOptions)
            .pipe(catchError(this.handleError<UUser>('createUser')))
    }

    patchItem(donation_id, deletePhoto, DonationName, DonatorID, dateDonated, date_received, itemCondition, itemquantity, photo): Observable<IInventory> {

        var params = new HttpParams({
            fromObject: {
                DonatorID: DonatorID,
                DateRecieved: date_received,
                Name: DonationName,
                DateDonated: dateDonated,
                Condition: itemCondition,
                Quantity: itemquantity,
                DeletePhoto: deletePhoto
            }
        })

        if (dateDonated == null) {
            params = new HttpParams({
                fromObject: {
                    DonatorID: DonatorID,
                    DateRecieved: date_received,
                    Name: DonationName,
                    Condition: itemCondition,
                    Quantity: itemquantity,
                    DeletePhoto: deletePhoto
                }
            })
        }

        let formData = new FormData();
        if(photo != null)
        {
            formData.append('upload', photo);
        }

        const httpOptions = {
            params: params
        }

        return this.http.patch<IInventory>('/api/donation?donation_id=' + donation_id, formData, httpOptions)
            .pipe(catchError(this.handleError<IInventory>('patchItem')))
    }

    async archiveItem(donator_id, dateReceived, parsedItems, Archived = false): Promise<boolean> {
        var finished = false

        const params = new HttpParams({
            fromObject: {
                DonatorID: parsedItems.DonatorID,
                DateRecieved: parsedItems.DateRecieved,
                DateDonated: parsedItems.DateDonated,
                Condition: parsedItems.Condition,
                PrimaryCategory: parsedItems.PrimaryCategory,
                SecondaryCategory: parsedItems.SecondaryCategory,
                Quantity: parsedItems.Quantity,
                Name: parsedItems.Name,
                Tag: parsedItems.Tag,
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        await this.http.post('/api/donation/archive', params, httpOptions).pipe(catchError(this.handleError('archiveItem'))).toPromise()


        return finished = true
    }

    patchEmail(EmailHeader, EmailBody): Observable<any> {
        const params = new HttpParams({
            fromObject: {
                EmailBody: EmailBody,
                EmailHeader: EmailHeader,
            }
        })


        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }
        return this.http.patch<any>('/api/donation/settings', params, httpOptions)
            .pipe(catchError(this.handleError<any>('patchSettings')))
    }


    patchUser(user_id, useremail, is_Admin): Observable<UUser> {
        const params = new HttpParams({
            fromObject: {
                Email: useremail,
                IsAdmin: is_Admin,
            }
        })


        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }
        return this.http.patch<UUser>('/api/user?UserID=' + user_id, params, httpOptions)
            .pipe(catchError(this.handleError<UUser>('patchUser')))
    }


    patchDonator(DonatorID, donator_name, donator_email, donator_phone, donator_town): Observable<DDonator> {
        const params = new HttpParams({
            fromObject: {
                DonatorID: DonatorID,
                Name: donator_name,
                Email: donator_email,
                Phone: donator_phone,
                Town: donator_town
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        return this.http.patch<DDonator>('/api/donator?DonatorID=' + DonatorID, params, httpOptions)
            .pipe(catchError(this.handleError<DDonator>('patchDonator')))
    }



    patchUserPass(user_id, pass): Observable<UUser> {
        const params = new HttpParams({
            fromObject: {
                Password: pass,
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        return this.http.patch<UUser>('/api/user?UserID=' + user_id, params, httpOptions)
            .pipe(catchError(this.handleError<UUser>('patchUserPass')))
    }

    patchItemWithoutDonation(donation_id, itemCondition, itemCategory, itemquantity): Observable<IInventory> {
        const params = new HttpParams({
            fromObject: {
                item_condition: itemCondition,
                item_type: itemCategory,
                item_quantity: itemquantity
            }
        })

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        }

        return this.http.patch<IInventory>('/api/donation?donation_id=' + donation_id, params, httpOptions)
            .pipe(catchError(this.handleError<IInventory>('patchItemWithoutDonation')))
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            if (error.error.reason != undefined)
                alert(error.error.reason)
            else
                alert("An error occured, please check any inputs")

            return of(result as T);
        }
    }

}