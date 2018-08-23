import { Component, OnInit, Input } from '@angular/core';

import { Compound } from '../../../_models';

@Component({
  selector: 'app-search-result-similar',
  templateUrl: './search-result-similar.component.html',
  styleUrls: ['./search-result-similar.component.scss']
})

export class SearchResultSimilarComponent implements OnInit {
  @Input() compound_result: Compound;
  @Input() mobile: boolean;
  num_similar: number = 2; // maximum number of similar compounds to show at one time

  constructor() { }

  ngOnInit() {
    // console.log(this.compound_result)
  }

}
