import {
  NgModule,
  Component
} from '@angular/core';

import {
  Router,
  RouterModule,
  Routes
} from '@angular/router';

import { RouteDef } from "./menu-bar/menu-bar.component";
import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from "./compound-data/compound-data.component";


let examples: RouteDef[] = [
  {label: 'Compound Search',          name: 'Root',          path: '',                component: CompoundSearchComponent},
  {label: 'Compound Data',          name: 'compound_data',         path: 'compound_data/:qid',          component: CompoundDataComponent },

];

// export let routes: Routes = examples
//   .map((example: RouteDef) => ({
//     path: example.path, component: example.component, pathMatch: 'full'
//   }));

export const routes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'compound_data/:qid', component: CompoundDataComponent, pathMatch: 'full' }
];


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  template: `
    <div class="ui menu">
      <div class="ui container">
        <a href="#" class="header item">

          <img src='../assets/logo-app.png' />
        </a>
        <div class="header item borderless">
          <h1 class="ui header">
            Repurpos.us: The Open and Expandable Drug Repurposing Portal
          </h1>
        </div>
      </div>
    </div>


    <!--<div class="ui container">-->
    <!--<div class="sixteen wide column">-->
    <!--<menu-bar [items]="examples"></menu-bar>-->
    <!---->
    <!--</div>-->

    <!--<div class="ui main container sixteen wide column">-->
    <!--<router-outlet></router-outlet>-->
    <!--</div>-->
    <!--</div>-->
    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span12">
          <menu-bar [items]="examples"></menu-bar>
          <router-outlet></router-outlet>
        </div>
      </div>
      <!--<div class="row-fluid">-->
      <!--<div class="span12">-->
      <!---->
      <!--</div>-->
      <!--</div>-->
    </div>
  `
})
export class AppComponent {
  examples: RouteDef[];

  constructor(private router: Router) {
    this.examples = examples; // store the outer examples
  }

}
