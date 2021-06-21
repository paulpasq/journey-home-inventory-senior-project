import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
    
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate() {
        if (this.loginService.checkLogin() == true){
            return true
        } else {
            window.alert("You don't have permission to view this page!")
            this.router.navigate(['/login'])
            return false
        }
    }
}