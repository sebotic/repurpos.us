import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


// import { DataTableModule, DataTable, DataTableResource } from 'angular-2-data-table';
import { DataTableModule, DataTable, DataTableResource } from './table/index';

import {
  RouterModule,
  Routes
} from '@angular/router';

import { AppComponent, routes } from './app.component';
import {MenuBarComponent, MenubarItemComponent} from './menu-bar/menu-bar.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {
  CompoundSearchComponent, SearchResultComponent, SearchBox,
  SearchResultTable, SearchResultService, Graph, GraphDataService, WDQService
} from './compound-search/compound-search.component';

import {cytoscape} from 'cytoscape';
import {UnlessDirective} from "./compound-search/unless.directive";
import {NgCytoscape} from "./compound-search/ng2-cytoscape";
import {CompoundDataComponent} from './compound-data/compound-data.component';
import {InteractionTableComponent, InteractionTableDataService} from './interaction-table/interaction-table.component';
import { DiseaseDataComponent } from './disease-data/disease-data.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MenubarItemComponent,
    CompoundSearchComponent,
    SearchResultComponent,
    SearchResultTable,
    SearchBox,
    UnlessDirective,
    NgCytoscape,
    Graph,
    CompoundDataComponent,
    InteractionTableComponent,
    DiseaseDataComponent,


  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    DataTableModule,


  ],
  providers: [
    { provide: APP_BASE_HREF,    useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: SearchResultService, useClass: SearchResultService },
    { provide: GraphDataService, useClass: GraphDataService },
    { provide: WDQService, useClass: WDQService },
    { provide: InteractionTableDataService, useClass: InteractionTableDataService },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
