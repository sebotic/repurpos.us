import { Component } from '@angular/core';

import { $ } from "protractor"; // needed by cytoscape.js

import { SearchResult } from '../_models/index';
import { SearchResultService, WDQService } from '../_services/index';
import { SearchBoxComponent, SearchResultComponent } from './index';

@Component({
  selector: 'app-compound-search',
  templateUrl: './compound-search.component.html',
})
export class CompoundSearchComponent {
  results: SearchResult[];

  constructor() {

  }

  updateResults(results: SearchResult[]): void {
    this.results = results;
  }
}




