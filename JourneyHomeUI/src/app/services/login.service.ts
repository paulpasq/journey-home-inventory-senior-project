import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {

    //Applys the login token expiration to the user
    loginSession(response) {
        let User = 'User'
        let expiration = new Date( new Date().getTime() + 86409000 )
        let IsAdmin = response.body.IsAdmin
        let userObj = {admin: IsAdmin, tokenExpiration: expiration}
        window.sessionStorage.setItem(User, JSON.stringify(userObj))
    }

    //Checks if the user's login token has expired
    checkLogin() {
        let isLoggedIn = false
        let stringValue = window.sessionStorage.getItem('User')
        if (stringValue !== null) {
            let value = JSON.parse(stringValue)
            let expiration = new Date(value.tokenExpiration)
            if (expiration > new Date()) {
                return isLoggedIn = true 
            } else {
            window.sessionStorage.removeItem('User')
            }
        } else {
            return isLoggedIn 
        }
    }

    //Checks to see if the user is an admin.
    //If the user is, they will have a different view compared to non-admins
    checkAdmin(){
        let admin = false
        let stringValue = window.sessionStorage.getItem('User')
        if (stringValue !== null){
            let value = JSON.parse(stringValue)
            let adminStatus = value.admin
            if (adminStatus == true){
                return admin = true
            } else {
                return admin = false
            }
        } else {
            return admin = false
        }
    }

    //Removes the user's login token
    destroySession() {
        window.sessionStorage.removeItem('User')
    }
}