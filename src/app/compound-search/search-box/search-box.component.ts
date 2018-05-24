import { Component, OnInit, ElementRef, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { SearchResult } from '../../_models/index';
import { WDQService } from '../../_services/WDQ.service';

@Component({
  outputs: ['results'],
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();
  searchQuery: string = '';
  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereo', 'label': 'stereofree exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'tanimoto', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]

	searchMode: string = 'exact';

  constructor(public wd: WDQService,
    private el: ElementRef,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams
      .subscribe(params => {
        if (params['query']) {
          this.searchQuery = params['query'];

          this.wd.searchFullText(this.searchQuery.toUpperCase(), ``)
            .subscribe(
              (results: SearchResult[]) => {
                this.results.next(results);
              },
              (err: any) => {
                console.log(err);
              }
            );
        }
      });
  }

  ngOnInit(): void {


    Observable.fromEvent(this.el.nativeElement, 'keyup')
      .map((e: any) => e.target.value) // extract the value of the input
      .filter((text: string) => text.length > 2) // filter out if shorter than 2 chars
      .debounceTime(500)  // only once every 500ms
      .subscribe((query: string) => {
        this.router.navigate(['.'], { queryParams: { query: query } });
      });
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
