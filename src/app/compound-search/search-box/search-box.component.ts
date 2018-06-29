import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
// import { Observable } from 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';

import { SearchResult } from '../../_models/index';
import { WDQService, BackendSearchService, SearchResultService, StructureService } from '../../_services/index';

@Component({
  outputs: ['results'],
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  // results: SearchResult[];
  searchQuery: string = '';

  // Change if the order of the search tabs change.
  textSearch_tabIdx: number = 0;
  structSearch_tabIdx: number = 1;
  selectedTab: number = this.textSearch_tabIdx;

  constructor(
    public searchSvc: BackendSearchService,
    private searchResultService: SearchResultService,
    private route: ActivatedRoute,
    private router: Router,
    private structSvc: StructureService
  ) {
    // Pull out any route parameters that already exist
    this.route.queryParams
      .subscribe(params => {

        // Launch text-based query
        if (params['query'] && 'type' in params && params['type'] === 'string') {
          this.searchQuery = params['query'];

          this.searchSvc.search(this.searchQuery)
            .subscribe(
              (results: SearchResult) => {
                // console.log(results)
                this.searchResultService.announceNewSearchResult(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }

        // Update the structure and get the molfile returned
        if (params['query'] && 'type' in params && params['type'] === 'structure') {
          this.searchQuery = params['query'];
          this.structSvc.announceSmiles(this.searchQuery);
          this.structSvc.getMolfile(this.searchQuery);
          this.structSvc.announceMode(params['mode']);
        }

        // Launch Tanimoto similarity search
        if (params['query'] && 'tanimoto' in params) {
          this.structSvc.announceTanimoto(params['tanimoto']);

          this.searchSvc.searchSimilarity(this.searchQuery, params['tanimoto'])
            .subscribe(
              (results: SearchResult) => {
                this.searchResultService.announceNewSearchResult(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }

        // Launch Exact and stereo-free structure matches
        if (params['query'] && 'type' in params && params['type'] === 'structure' && params['mode'] === 'exact') {
          this.searchSvc.searchStructExact(this.searchQuery, 'exact')
            .subscribe(
              (results: SearchResult) => {
                this.searchResultService.announceNewSearchResult(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        } else if (params['query'] && 'type' in params && params['type'] === 'structure' && params['mode'] === 'stereofree') {

          this.searchSvc.searchStructExact(this.searchQuery, 'stereofree')
            .subscribe(
              (results: SearchResult) => {
                this.searchResultService.announceNewSearchResult(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }



      });


  }

  catchError(err: any) {
    this.searchResultService.announceNewSearchResult(new SearchResult(err));
  }

  // when changing between tabs, reset (delete) the search parameters
  resetInput(event) {
    this.structSvc.announceMode('exact');
    this.structSvc.announceTanimoto(0.85);
    this.structSvc.announceSmiles('');
    this.structSvc.announceMolFile('');
    this.searchQuery = '';
    // this.searchResultService.announceSubmit(false);

    let search_type: string;

    // make sure the tab is set to the correct search mode.
    if (event.index === this.textSearch_tabIdx) {
      search_type = "string";
    } else if (event.index === this.structSearch_tabIdx) {
      search_type = "structure"
    }
    // reset the route to the search or structure page, sans any input
    this.router.navigate(['search/'], { queryParams: { type: search_type } });
  }

  ngOnInit(): void {

    // Set the tab in the route to the correct
    this.route.queryParams.subscribe(values => {
      if (values.type === 'string') {
        this.selectedTab = this.textSearch_tabIdx;
      } else if (values.type === 'structure') {
        this.selectedTab = this.structSearch_tabIdx;
      }
    });

  }
}
