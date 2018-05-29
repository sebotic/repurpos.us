import { Component, OnInit, Input } from '@angular/core';

import { SimilarityData } from '../../_models/index';

import * as Chroma from 'chroma-js';


@Component({
  selector: 'app-similar-compounds',
  templateUrl: './similar-compounds.component.html',
  styleUrls: ['./similar-compounds.component.css']
})

export class SimilarCompoundsComponent implements OnInit {
  @Input() similarityResults: Array<SimilarityData>;

  similarityData: Array<SimilarityData> = [];

  tanimotoScale = Chroma.scale(['#ffffff', '#ffb6b0', '#f36664', '#c3152e']).mode('lab');

  results_per_page: number = 4;
  num_results: number = this.results_per_page;


  constructor() { }

  ngOnInit() {
    this.prepSimilarityData();
  }

  prepSimilarityData(){

    this.similarityData = this.similarityResults;
    this.similarityData = this.similarityData.sort((a:any, b:any) => b.tanimoto - a.tanimoto);

  }

  getFontColor(background_color: any) {
    if (Chroma.contrast(background_color, '#212529') > 4.5) {
      return '#212529';
    }
    return '#ffffff';
  }

  showMore() {
    this.num_results += this.results_per_page;
    // check to make sure haven't hit the end of the results
    this.num_results = Math.min(this.num_results, this.similarityData.length);
  }

}
