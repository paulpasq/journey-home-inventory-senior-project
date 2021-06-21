import { Routes } from '@angular/router';

import {
    InventoryComponent
} from './main_inventory/index'
import {
    AddInventoryComponent
} from './add_inventory/index'

import { UserManagementComponent } from './user_management/index';
import { DonorManagementComponent } from './donor_management/index';
import { OnlyLoggedInUsersGuard } from './services';
import { LoginComponent } from './login';
import { ChartsComponent } from './charts/charts.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inventory/:location', component: InventoryComponent, canActivate: [OnlyLoggedInUsersGuard] },
    { path: 'addInventory', component: AddInventoryComponent, canActivate: [OnlyLoggedInUsersGuard] },
    { path: 'userManagement', component: UserManagementComponent, canActivate: [OnlyLoggedInUsersGuard] },
    { path: 'donorManagement', component: DonorManagementComponent, canActivate: [OnlyLoggedInUsersGuard] },
    { path: 'charts', component: ChartsComponent, canActivate: [OnlyLoggedInUsersGuard] },
]