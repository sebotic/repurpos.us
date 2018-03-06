import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';


// import { DataTableModule, DataTable, DataTableResource } from 'angular-2-data-table';
// import { DataTableModule, DataTable, DataTableResource } from './table/index';

import {
  RouterModule,
  Routes
} from '@angular/router';

import { AppComponent, routes } from './app.component';
import {MenuBarComponent, MenubarItemComponent} from './menu-bar/menu-bar.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {
  CompoundSearchComponent, SearchResultComponent, SearchBox, SearchResultService, WDQService
} from './compound-search/compound-search.component';


import {cytoscape} from 'cytoscape';
import {NgCytoscape} from "./compound-search/ng2-cytoscape";
import {CompoundDataComponent} from './compound-data/compound-data.component';
// import {InteractionTableComponent, InteractionTableDataService} from './interaction-table/interaction-table.component';
// import { DiseaseDataComponent } from './disease-data/disease-data.component';
import {CIDService, NglComponent} from './ngl/ngl.component';
import { CompoundSearchOptionsComponent } from './compound-search/compound-search-options/compound-search-options.component';
import { IndicationsGraphComponent, GraphDataService } from './compound-data/indications-graph/indications-graph.component';
// import { SearchResultTableComponent } from './compound-search/search-result-table/search-result-table.component';
import {HttpClientModule, HttpClientXsrfModule} from "@angular/common/http";
import {AuthComponent, AuthGuard, AuthService} from './auth/auth.component';
import {DialogOverviewExample, DialogOverviewExampleDialog, EditItemComponent} from './edit-item/edit-item.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import {
  // MatAutocompleteModule,
  MatButtonModule,
  // MatButtonToggleModule,
  // MatCardModule,
  // MatCheckboxModule,
  // MatChipsModule,
  // MatDatepickerModule,
  MatDialogModule,
  // MatExpansionModule,
  // MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  // MatMenuModule,
  // MatNativeDateModule,
  MatPaginatorModule,
  // MatProgressBarModule,
  // MatProgressSpinnerModule,
  // MatRadioModule,
  // MatRippleModule,
  MatSelectModule,
  // MatSidenavModule,
  // MatSliderModule,
  // MatSlideToggleModule,
  // MatSnackBarModule,
  // MatSortModule,
  MatTableModule,
  // MatTabsModule,
  // MatToolbarModule,
  MatTooltipModule,
  // MatStepperModule,
} from '@angular/material';
import {
  MailSignupComponent, MailSignupDialog,
} from './mail-signup/mail-signup.component';
import { ShowMoreButtonComponent, ShowMorePane } from './compound-data/show-more-button/show-more-button.component';
import { SearchResultsTableComponent } from './compound-search/search-results-table/search-results-table.component';
import {CdkTableModule} from "@angular/cdk/table";
import { RecaptchaModule } from 'ng-recaptcha';
import { UserLoginComponent } from './user-login/user-login.component';

import { UserRegButtonComponent } from './_components/user-reg-button/user-reg-button.component';
import { TermsComponent } from './_dialogs/terms/terms.component';
import { UserRegistrationComponent } from './_dialogs/user-registration/user-registration.component';

@NgModule({
  exports: [
    CdkTableModule,
    // MatAutocompleteModule,
    MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatStepperModule,
    // MatDatepickerModule,
    MatDialogModule,
    // MatExpansionModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    // MatMenuModule,
    // MatNativeDateModule,
    MatPaginatorModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatRadioModule,
    // MatRippleModule,
    MatSelectModule,
    // MatSidenavModule,
    // MatSliderModule,
    // MatSlideToggleModule,
    // MatSnackBarModule,
    // MatSortModule,
    MatTableModule,

    // MatTabsModule,
    // MatToolbarModule,
    MatTooltipModule,
  ],
  declarations: [],

})
export class MaterialModule {}


@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MenubarItemComponent,
    CompoundSearchComponent,
    SearchResultComponent,
    SearchBox,
    NgCytoscape,
    IndicationsGraphComponent,
    CompoundDataComponent,
    // InteractionTableComponent,
    // DiseaseDataComponent,
    NglComponent,
    CompoundSearchOptionsComponent,
    IndicationsGraphComponent,
    // SearchResultTableComponent,
    AuthComponent,
    AuthGuard,
    EditItemComponent,
    DialogOverviewExample,
    DialogOverviewExampleDialog,
    MailSignupComponent,
    MailSignupDialog,
    ShowMorePane,
    ShowMoreButtonComponent,
    SearchResultsTableComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    UserRegButtonComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    // DataTableModule,
    HttpClientModule,
    MaterialModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    BrowserAnimationsModule,
    // MatNativeDateModule,

    FormsModule,
    ReactiveFormsModule,

    RecaptchaModule.forRoot(),
  ],

  providers: [
    { provide: APP_BASE_HREF,    useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: SearchResultService, useClass: SearchResultService },
    { provide: GraphDataService, useClass: GraphDataService },
    { provide: WDQService, useClass: WDQService },
    // { provide: InteractionTableDataService, useClass: InteractionTableDataService },
    { provide: CIDService, useClass: CIDService},
    { provide: AuthService, useClass: AuthService},

  ],
  entryComponents: [
    DialogOverviewExample,
    DialogOverviewExampleDialog,

    MailSignupDialog,
    // UserLoginComponent,
    // UserRegComponent,
    UserRegistrationComponent,
    TermsComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
