import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'hammerjs';


// import { DataTableModule, DataTable, DataTableResource } from 'angular-2-data-table';
// import { DataTableModule, DataTable, DataTableResource } from './table/index';

import {
  RouterModule,
  Routes
} from '@angular/router';

import { AppRoutingModule, routedComponents } from './app-routing.module';

import { AppComponent } from './app.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import { CompoundSearchComponent, CompoundSearchOptionsComponent, SearchBoxComponent, SearchResultComponent, SearchResultsTableComponent } from './compound-search/index';

// import {cytoscape} from 'cytoscape';
// import {NgCytoscape} from "./compound-search/ng2-cytoscape";
import { CompoundDataComponent } from './compound-data/compound-data.component';
import { NglComponent } from './compound-data/ngl/ngl.component';
// import {InteractionTableComponent, InteractionTableDataService} from './compound-data/interaction-table/interaction-table.component';
// import { DiseaseDataComponent } from './disease-data/disease-data.component';
import { IndicationsGraphComponent } from './compound-data/indications-graph/indications-graph.component';
// import { SearchResultTableComponent } from './compound-search/search-result-table/search-result-table.component';
import {HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
  MatExpansionModule,
  // MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  // MatMenuModule,
  // MatNativeDateModule,
  MatPaginatorModule,
  // MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  // MatRippleModule,
  MatSelectModule,
  // MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  // MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  // MatToolbarModule,
  MatTooltipModule,
  // MatStepperModule,
} from '@angular/material';

import { ShowMoreButtonComponent, ShowMorePane } from './compound-data/show-more-button/show-more-button.component';
// import {CdkTableModule} from "@angular/cdk/table";
import { RecaptchaModule } from 'ng-recaptcha';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './about/about.component';
import { AssaysComponent } from './assays/assays.component';
import {
  AssayDataComponent,
  AssayPaginationComponent,
  AssayPlotsComponent,
  DotPlotComponent,
  CmpdTooltipComponent
} from './assay-data/index';

import {
  AssayDwnldComponent,
  AssayTypeBtnComponent,
  ForgotPassButtonComponent,
  LoaderComponent,
  MailSignupComponent,
  MailSignupDialogComponent,
  QuickSearchComponent,
  UserLoginComponent,
  UserRegButtonComponent,
  DialogOverviewExample,
  DialogOverviewExampleDialog,
  EditItemComponent,
  MenuBarComponent,
  MenubarItemComponent
} from './_components/index';

import { ForgotPasswordComponent, LoginFailComponent, TermsComponent, UserRegistrationComponent } from './_dialogs/index';
import { AuthGuard } from './_guards/auth.guard';
import { LoaderInterceptorService } from './_interceptors/loader-interceptor.service';
import {
  AuthService,
  CIDService,
  GoogleAnalyticsService,
  GraphDataService,
  LoaderStateService,
  LoginStateService,
  SearchResultService,
  WDQService,
  StructureService,
  TanimotoScaleService,
  BackendSearchService
} from './_services/index';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompoundHeaderComponent } from './compound-data/compound-header/compound-header.component';
import { SimilarCompoundsComponent } from './compound-data/similar-compounds/similar-compounds.component';
import { CompoundAssayDataComponent } from './compound-data/compound-assay-data/compound-assay-data.component';
import { CompoundVendorDataComponent } from './compound-data/compound-vendor-data/compound-vendor-data.component';
import { CompoundWikidataComponent } from './compound-data/compound-wikidata/compound-wikidata.component';
import { CompoundWikidataIdsComponent } from './compound-data/compound-wikidata-ids/compound-wikidata-ids.component';
import { StructureSearchOptionsComponent } from './compound-search/search-box/structure-search/structure-search-options/structure-search-options.component';
import { StructureSearchComponent } from './compound-search/search-box/structure-search/structure-search.component';
import { TextSearchComponent } from './compound-search/search-box/text-search/text-search.component';
import { KetcherComponent } from './compound-search/search-box/structure-search/ketcher/ketcher.component';
import { IntroTextComponent } from './intro-text/intro-text.component';

@NgModule({
  exports: [
    // CdkTableModule,
    // MatAutocompleteModule,
    MatButtonModule,
    // MatButtonToggleModule,
    // MatCardModule,
    // MatCheckboxModule,
    // MatChipsModule,
    // MatStepperModule,
    // MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    // MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    // MatMenuModule,
    // MatNativeDateModule,
    MatPaginatorModule,
    // MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    // MatRippleModule,
    MatSelectModule,
    // MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    // MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
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
    SearchBoxComponent,
    // NgCytoscape,
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
    AuthGuard,
    EditItemComponent,
    DialogOverviewExample,
    DialogOverviewExampleDialog,
    MailSignupComponent,
    MailSignupDialogComponent,
    ShowMorePane,
    ShowMoreButtonComponent,
    SearchResultsTableComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    UserRegButtonComponent,
    ForgotPassButtonComponent,
    TermsComponent,
    LoginFailComponent,
    LoaderComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    QuickSearchComponent,
    CompoundHeaderComponent,
    SimilarCompoundsComponent,
    CompoundAssayDataComponent,
    CompoundVendorDataComponent,
    CompoundWikidataComponent,
    CompoundWikidataIdsComponent,
    StructureSearchOptionsComponent,
    StructureSearchComponent,
    TextSearchComponent,
    KetcherComponent,
    IntroTextComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    //RouterModule.forRoot(routes),
    // DataTableModule,
    HttpClientModule,
    MaterialModule,

    // MatDialogModule,
    // MatButtonModule,
    // MatInputModule,
    // MatProgressSpinnerModule,
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
    { provide: TanimotoScaleService, useClass: TanimotoScaleService },
    { provide: StructureService, useClass: StructureService },
    { provide: BackendSearchService, useClass: BackendSearchService},
    // { provide: InteractionTableDataService, useClass: InteractionTableDataService },
    { provide: CIDService, useClass: CIDService},
    { provide: AuthService, useClass: AuthService},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
    LoaderStateService,
    LoginStateService,
    GoogleAnalyticsService
  ],
  entryComponents: [
    DialogOverviewExample,
    DialogOverviewExampleDialog,

    MailSignupDialogComponent,
    // UserLoginComponent,
    // UserRegComponent,
    UserRegistrationComponent,
    TermsComponent,
    LoginFailComponent,
    ForgotPasswordComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
