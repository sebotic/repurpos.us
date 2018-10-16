import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs/subscription';

import { LoaderStateService } from '../../_services/index';
import { LoaderState } from '../../_models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'http-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  show: number = 0;
  mode: string;
  private subscription: Subscription;
  private rteSubscription: Subscription;

  constructor(private loaderService: LoaderStateService, private route: ActivatedRoute) {

    this.rteSubscription = this.route.queryParams
      .subscribe(params => {
        this.mode = params.type;
        console.log(this.mode)
      });

    // let params = this.route;
    // console.log(params)
    // console.log(params.queryParams['_value'])
    //     // this.structSvc.modeAnnounced$.subscribe(mode => {
    //       this.mode = params['type'];
    //     // });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.rteSubscription.unsubscribe();
  }

}
