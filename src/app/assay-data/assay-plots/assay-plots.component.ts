import { Component, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';

import { LoginState } from '../../_models/index';
import { LoginStateService, AssayDataService } from '../../_services/index';
import { AssayPaginationComponent } from '../assay-pagination/assay-pagination.component'

@Component({
  selector: 'app-assay-plots',
  templateUrl: './assay-plots.component.html',
  styleUrls: ['./assay-plots.component.scss']
})

export class AssayPlotsComponent implements OnDestroy {
  @Input() assay_title: string;
  @Input() aid: string;
  public loggedIn: boolean;

  private loginSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataSvc: AssayDataService,
    private loginStateService: LoginStateService
  ) {
    this.loginSubscription =
      combineLatest(loginStateService.isUserLoggedIn, route.params).subscribe(([login, params]) => {
        if (login.loggedIn === true && params['aid']) {
          this.loggedIn = true;
          this.aid = params['aid'];
          this.dataSvc.retrieveAssayData(this.aid);
        }
      })
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

}
