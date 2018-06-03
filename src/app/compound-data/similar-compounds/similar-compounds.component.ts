import { Component, OnInit, Input } from '@angular/core';

import { SimilarityData } from '../../_models/index';

import { TanimotoScaleService } from '../../_services/index';


@Component({
  selector: 'app-similar-compounds',
  templateUrl: './similar-compounds.component.html',
  styleUrls: ['./similar-compounds.component.css']
})

export class SimilarCompoundsComponent implements OnInit {
  @Input() similarityResults: Array<SimilarityData>;
  @Input() results_per_page: number;

  similarityData: Array<SimilarityData> = [];

  tanimotoScale: any; // color scale for tanimoto scores

  num_results: number; // current number of results displayed


  constructor(private tanimotoSvc: TanimotoScaleService) {
    this.tanimotoScale = tanimotoSvc.getScale();
  }

  ngOnInit() {
    this.num_results = this.results_per_page;
    this.prepSimilarityData();
  }

  prepSimilarityData(){
    this.similarityData = this.similarityResults;
    this.similarityData = this.similarityData.sort((a:any, b:any) => b.tanimoto - a.tanimoto);

  }

  showMore() {
    this.num_results += this.results_per_page;
    // check to make sure haven't hit the end of the results
    this.num_results = Math.min(this.num_results, this.similarityData.length);
  }

}
