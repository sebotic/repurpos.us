import { Component, OnDestroy } from '@angular/core';

import { AssayDataService } from '../../_services';

import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-assay-pagination',
  templateUrl: './assay-pagination.component.html',
  styleUrls: ['./assay-pagination.component.scss']
})

export class AssayPaginationComponent implements OnDestroy {
  private current_assay: string;
  private current_page: number;
  public pages: number[];

  private allSubscription: Subscription;
  private currentSubscription: Subscription;


  constructor(private dataSvc: AssayDataService) {

    this.allSubscription = combineLatest(this.dataSvc.totalPageSubject$, this.dataSvc.currentAssayTypeSubject$).subscribe(([pages, assayType]) => {
      if (pages && assayType) {
        this.current_assay = assayType;

        // create array of numbers from 0:num_pages
        let num_pages = pages[this.current_assay].totalPages;
        this.pages = Array.apply(null, { length: num_pages }).map(Number.call, Number);
      }
    })

    this.currentSubscription = this.dataSvc.currentPageSubject$.subscribe(pageNum => {
      this.current_page = pageNum;
    })

  }

ngOnDestroy() {
  this.allSubscription.unsubscribe();
  this.currentSubscription.unsubscribe();
}

  // On event detection with page change, switch the page number.
  switchPage(event) {
    this.current_page = Number(event.target.id);
    this.dataSvc.currentPageSource.next(this.current_page);
  }

}
