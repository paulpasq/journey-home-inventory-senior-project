import { Component } from '@angular/core';

@Component({
  selector: 'inventory-app',
  template: `
  <router-outlet></router-outlet>
  `
})
export class InventoryAppComponent {
  title = 'journey-home';
}