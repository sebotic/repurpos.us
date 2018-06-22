import { Component, OnInit,  EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { switchMap } from 'rxjs/operators';

import { SearchResult } from '../../_models/index';
import { WDQService, BackendSearchService, StructureService } from '../../_services/index';

@Component({
  outputs: ['results'],
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  searchQuery: string = '';

  // Change if the order of the search tabs change.
  textSearch_tabIdx: number = 0;
  structSearch_tabIdx: number = 1;
  selectedTab: number = this.textSearch_tabIdx;

  constructor(public wd: BackendSearchService,
    private route: ActivatedRoute,
    private router: Router,
    private structSvc: StructureService
  ) {
    this.route.queryParams
      .subscribe(params => {
        if (params['query'] && 'type' in params && params['type'] === 'string') {
          this.searchQuery = params['query'];

          this.wd.search(this.searchQuery)
            .subscribe(
              (results: SearchResult[]) => {
                this.results.next(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }

        // Set the structure and get the molfile returned
        if (params['query'] && 'type' in params && params['type'] === 'structure') {
          this.searchQuery = params['query'];
          this.structSvc.announceSmiles(this.searchQuery, true);
          this.structSvc.announceMode(params['mode']);
        }

        // Tanimoto similarity search
        if (params['query'] && 'tanimoto' in params) {
          this.structSvc.announceTanimoto(params['tanimoto']);

          this.wd.searchSimilarity(this.searchQuery, params['tanimoto'])
            .subscribe(
              (results: SearchResult[]) => {
                this.results.next(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }

        // Exact and stereo-free structure matches
        if (params['query'] && 'type' in params && params['type'] === 'structure' && params['mode'] === 'exact') {
          this.wd.searchStructExact(this.searchQuery, 'exact')
            .subscribe(
              (results: SearchResult[]) => {
                this.results.next(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        } else if (params['query'] && 'type' in params && params['type'] === 'structure' && params['mode'] === 'stereofree') {

          this.wd.searchStructExact(this.searchQuery, 'stereofree')
            .subscribe(
              (results: SearchResult[]) => {
                this.results.next(results);
              },
              (err: any) => {
                this.catchError(err);
              }
            );
        }



      });


  }

  catchError(err: any){
    console.log(err);
    console.log(err.status)
  }

  // when changing between tabs, reset (delete) the search parameters
  resetInput(event) {
    this.structSvc.announceMode('exact');
    this.structSvc.announceTanimoto(0.85);
    this.structSvc.announceSmiles('', true);
    this.results.next([]);
    // console.log(event)
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
      // console.log(values);
      if (values.type === 'string') {
        this.selectedTab = this.textSearch_tabIdx;
      } else if (values.type === 'structure') {
        this.selectedTab = this.structSearch_tabIdx;
      }
    });


    // functioning code as of 30 May 2018; based on auto-launching searchQuery
    // Observable.fromEvent(this.el.nativeElement, 'keyup')
    //   .map((e: any) => e.target.value) // extract the value of the input
    //   .filter((text: string) => text.length > 2) // filter out if shorter than 2 chars
    //   .debounceTime(500)  // only once every 500ms
    //   .subscribe((query: string) => {
    //     this.router.navigate(['.'], { queryParams: { query: query } });
    //   });
    // --- end working code ---

    // .map((query: string) => this.wd.searchFullText(query ,``))
    // .switch()
    // // act on the return of the search
    // .subscribe(
    //   (results: SearchResult[]) => { // on sucesss
    //     this.results.next(results);
    //     console.log(results);
    //   },
    //   (err: any) => { // on error
    //     console.log(err);
    //   },
    //   () => { // on completion
    //   }
    // );

  }
}
