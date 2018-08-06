import { Component, OnInit, OnChanges, Input } from '@angular/core';

//import { SimilarityData, Compound } from '../../_models/index';
import { CompoundService } from '../../_services/index';
import { Compound } from '../../_models/index';

import { TanimotoScaleService } from '../../_services/index';


@Component({
  selector: 'app-similar-compounds',
  templateUrl: './similar-compounds.component.html',
  styleUrls: ['./similar-compounds.component.scss']
})

export class SimilarCompoundsComponent implements OnInit {
  private similarityResults: Array<Compound>;
  @Input() results_per_page: number;

  tanimotoScale: any; // color scale for tanimoto scores

  num_results: number; // current number of results displayed


  constructor(private tanimotoSvc: TanimotoScaleService, private cmpdSvc: CompoundService) {
    this.tanimotoScale = tanimotoSvc.getScale();

    this.cmpdSvc.similarState.subscribe((sdata: Compound[]) => {
      this.similarityResults = sdata;
      // console.log(sdata)
    })
  }

  ngOnInit() {
    this.num_results = this.results_per_page;
  }

  ngOnChanges() {
    this.prepSimilarityData();
  }

  prepSimilarityData() {
    if (this.similarityResults) {
      this.similarityResults = this.similarityResults.sort((a: any, b: any) => b.tanimoto - a.tanimoto);
    }
    // console.log(this.similarityResults)
  }

  showMore() {
    this.num_results += this.results_per_page;
    // check to make sure haven't hit the end of the results
    this.num_results = Math.min(this.num_results, this.similarityResults.length);
  }

}
