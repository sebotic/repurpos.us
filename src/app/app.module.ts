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

import { AppRoutingModule, routedComponents } from './app-routing.module';

import { AppComponent } from './app.component';
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
import {HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
  MatProgressSpinnerModule,
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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UserLoginComponent } from './user-login/user-login.component';
import { AboutComponent } from './about/about.component';
import { AssaysComponent } from './assays/assays.component';
import { AssayPlotsComponent } from './assay-plots/assay-plots.component';
import { AssayDataComponent } from './assay-data/assay-data.component';
import { DotPlotComponent } from './dot-plot/dot-plot.component';
import { AssayDwnldComponent } from './assay-dwnld/assay-dwnld.component';
import { AssayTypeBtnComponent } from './assay-type-btn/assay-type-btn.component';
import { AssayPaginationComponent } from './assay-pagination/assay-pagination.component';
import { CmpdTooltipComponent } from './cmpd-tooltip/cmpd-tooltip.component';

import { LoaderComponent, UserRegButtonComponent } from './_components/index';
import { LoginFailComponent, TermsComponent, UserRegistrationComponent } from './_dialogs/index';
import { LoaderInterceptorService } from './_interceptors/loader-interceptor.service';
import { LoaderStateService, LoginStateService } from './_services/index';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

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
    MatProgressSpinnerModule,
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
    ConfirmEmailComponent,

    AboutComponent,
    AssaysComponent,
    AssayDataComponent,
    AssayPlotsComponent,
    DotPlotComponent,
    AssayDwnldComponent,
    AssayTypeBtnComponent,
    AssayPaginationComponent,
    CmpdTooltipComponent,
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
    TermsComponent,
    LoginFailComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    //RouterModule.forRoot(routes),
    // DataTableModule,
    HttpClientModule,
    MaterialModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    // MatNativeDateModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),

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
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    LoaderStateService,
    LoginStateService
  ],
  entryComponents: [
    DialogOverviewExample,
    DialogOverviewExampleDialog,

    MailSignupDialog,
    // UserLoginComponent,
    // UserRegComponent,
    UserRegistrationComponent,
    TermsComponent,
    LoginFailComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
