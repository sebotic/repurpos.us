import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs/subscription';

import { CompoundSearchComponent } from '../compound-search/compound-search.component'
import { CompoundDataComponent } from "../compound-data/compound-data.component";
import { AboutComponent } from "../about/about.component";
import { AssaysComponent } from "../assays/assays.component";
import { AssayDataComponent } from "../assay-data/assay-data.component";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { isDefined } from "@angular/compiler/src/util";
import { environment } from "../../environments/environment";
import { LoginStateService } from '../_services/index';
import { LoginState, RouteDef } from '../_models/index';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  routeDef: RouteDef[];
  loginBox: boolean = false;
  loggedIn: boolean = false;
  expanded: boolean = false;
  current_year: number;
  private loginSubscription: Subscription;

  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient, private loginStateService: LoginStateService) {
  }

  showLogin() {
    this.loginBox = !this.loginBox;
  }

  toggleNav() {
    this.expanded = !this.expanded;
    if (!this.expanded) {
      this.loginBox = false;
    }
  }

  collapseNav() {
    this.expanded = false;
  }


  ngOnInit(): void {
    // subscribe to the login state
    this.loginSubscription = this.loginStateService.loginState
      .subscribe((state: LoginState) => {
        this.loggedIn = state.loggedIn;
      });

  }
}
