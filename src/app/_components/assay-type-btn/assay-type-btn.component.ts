import { Component, OnChanges, OnDestroy } from '@angular/core';
import * as d3 from 'd3';

import { Subscription } from 'rxjs/subscription';
import { AssayDataService } from '../../_services/index';

@Component({
  selector: 'app-assay-type-btn',
  templateUrl: './assay-type-btn.component.html',
  styleUrls: ['./assay-type-btn.component.scss']
})

export class AssayTypeBtnComponent implements OnChanges {
  private assay_types: Array<string>;
  private current_assay: string;
  private typeSubscription: Subscription;
  private currentSubscription: Subscription;

  constructor(private dataSvc: AssayDataService) {
    this.typeSubscription = dataSvc.assayTypesSubject$.subscribe(types => {
      this.assay_types = types;
      this.updateTabs();
    })

    this.currentSubscription = dataSvc.currentAssayTypeSubject$.subscribe(currentType => {
      this.current_assay = currentType;
    })
  }


  updateTabs() {
    const tabs = d3.select('#tabs');

    if (this.assay_types.includes('IC')) {
      tabs.select('#IC').classed('hidden', false);
    } else {
      tabs.select('#IC').classed('hidden', true);
    }

    if (this.assay_types.includes('EC')) {
      tabs.select("#EC").classed('hidden', false);
    } else {
      tabs.select("#EC").classed('hidden', true);
    }


    // set current tab to be active
    if (this.current_assay == 'EC') {
      tabs.select('#EC').classed('active', true);
      tabs.select('#IC').classed('active', false);
    } else {
      tabs.select('#IC').classed('active', true);
      tabs.select('#EC').classed('active', false);
    }
  }

  ngOnChanges() {
    this.updateTabs();
  }

  // Event listener if the IC/EC50 tab is clicked
  // Change what data are filtered: observable within dataSvc will call the update method.
  switchAssay(event) {
    this.current_assay = event.target.id;
    this.dataSvc.currentAssayTypeSource.next(this.current_assay);
    this.updateTabs();
    // Helper if an IC/EC50 tab is pressed: resets page idx to 0.
    this.dataSvc.currentPageSource.next(0);
  }

  ngOnDestroy() {
    this.typeSubscription.unsubscribe();
    this.currentSubscription.unsubscribe();
  }

}
