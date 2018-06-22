import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SearchResult } from '../_models/index';

@Injectable()
export class SearchResultService {
  // Observable string sources
  private newSearchResultSource = new Subject<SearchResult>();

  // Observable string streams
  newSearchResult$ = this.newSearchResultSource.asObservable();

  // Service message commands
  announceNewSearchResult(result: SearchResult) {
    this.newSearchResultSource.next(result);
    // console.log(result);
  }
}
