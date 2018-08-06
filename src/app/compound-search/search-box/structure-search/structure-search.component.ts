import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { SearchResultService } from '../../../_services/index';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.scss']
})

export class StructureSearchComponent implements OnInit {
  // structureQuery: string;
  panelOpenState: boolean = true;
  pressed: boolean = false;
  molfile: string;

  submitSubscription: Subscription;

  constructor(private searchSvc: SearchResultService, private route: ActivatedRoute) {
    // service to check if the submit button has been pressed.
    this.submitSubscription = searchSvc.submitAnnounced$.subscribe(pressedStatus => {
      let windowHeight: number = window.screen.height;
      if (pressedStatus && windowHeight < 1100) {
        this.pressed = true;
        this.panelOpenState = false;
      } else {
        this.pressed = false;
        this.panelOpenState = true;
      }
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
  }

}
