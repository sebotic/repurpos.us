import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SearchResult } from '../_models/index';

@Injectable()
export class SearchResultService {
  // Observable string sources
  private newSearchResultSource = new Subject<SearchResult>();

  // Observable string streams
  newSearchResult$ = this.newSearchResultSource.asObservable();

  // Announce if search button has been submitted, to determine whether to display table or not.
  private submitAnnouncedSource = new Subject<boolean>();
  submitAnnounced$ = this.submitAnnouncedSource.asObservable();

  // Service message commands
  announceNewSearchResult(result: SearchResult) {
    this.newSearchResultSource.next(result);
    this.announceSubmit(true);
  }

  announceSubmit(submitStatus: boolean) {
    this.submitAnnouncedSource.next(submitStatus);
  }
}
