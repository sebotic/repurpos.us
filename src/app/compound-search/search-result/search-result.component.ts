import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SearchResult } from '../../_models/index';
import { SearchResultService } from '../../_services/index';

@Component({
	inputs: ['result'],
	outputs: ['sdata'],
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit{
  result: SearchResult;

  constructor(public searchResultService: SearchResultService, private route: ActivatedRoute) {

  }

  announce() {
    this.searchResultService.announceNewSearchResult(this.result);
    console.log(this.result)
  }

  ngOnInit(){
    this.announce();
   }
}