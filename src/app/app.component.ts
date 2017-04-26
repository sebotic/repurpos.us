import { Component } from '@angular/core';

import {
  Router,
  Routes
} from '@angular/router';

import { RouteDef } from "./menu-bar/menu-bar.component";
import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from "./compound-data/compound-data.component";


let routeDef: RouteDef[] = [
  {label: 'Compound Search', name: 'Root', path: '', component: CompoundSearchComponent},
  {label: 'Compound Data', name: 'compound_data', path: 'compound_data/:qid', component: CompoundDataComponent },

];


export const routes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'compound_data/:qid', component: CompoundDataComponent, pathMatch: 'full' }
];


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent {
  routeDef: RouteDef[];

  constructor(private router: Router) {
    this.routeDef = routeDef;
  }

}
