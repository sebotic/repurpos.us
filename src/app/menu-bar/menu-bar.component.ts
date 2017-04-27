// import { Component, OnInit } from '@angular/core';
//
// @Component({
//   selector: 'app-menu-bar',
//   templateUrl: './menu-bar.component.html',
//   styleUrls: ['./menu-bar.component.css']
// })
// export class MenuBarComponent implements OnInit {
//
//   constructor() { }
//
//   ngOnInit() {
//   }
//
// }

import {
  Component,
  Input
} from '@angular/core';
import { Location } from '@angular/common';
import {
  Router,
  ActivatedRoute
} from '@angular/router';


export interface RouteDef {
  label: string;  // link label
  name: string;   // route name of the example
  path: string;   // route path
  component: any; // component class
  dev?: boolean;  // is it an intermediate step?
}

@Component({
  selector: 'menubar-item',
  template: `
    <a class="item"
       [ngClass]="{ active: isActive() }"
       [routerLink]="[item.path]">
      {{ item.label }}
    </a>
  `
})
export class MenubarItemComponent {
  @Input('item') item: RouteDef;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
  }

  isActive(): boolean {
    return `/${this.item.path}` === this.location.path();
  }
}

@Component({
  selector: 'menu-bar',
  template: `
    <div class="ui horizontal pointing menu">
      <menubar-item
        [item]="item"
        *ngFor="let item of items">
      </menubar-item>
    </div>
  `
})
export class MenuBarComponent {
  @Input('items') items: RouteDef[];
}
