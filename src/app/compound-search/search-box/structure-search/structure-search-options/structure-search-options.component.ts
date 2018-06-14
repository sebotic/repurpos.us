import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { StructureService } from '../../../../_services/index';

@Component({
  selector: 'app-structure-search-options',
  templateUrl: './structure-search-options.component.html',
  styleUrls: ['./structure-search-options.component.css']
})

export class StructureSearchOptionsComponent implements OnInit {
  ketcher_query: string;
  text_query: string;
  structureSubscription: Subscription;
  submitted: boolean = false;

  // initial options + placeholders to save from user input
  searchMode: string = 'exact';
  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereofree', 'label': 'stereo-free exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'similarity', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]



  constructor(private router: Router, private route: ActivatedRoute, private structSvc: StructureService) {
    console.log('route')
    console.log(route.queryParams['_value'])

    // Update the params, based on the route, if needed
    let params = route.queryParams['_value'];
    if (params.hasOwnProperty('mode')) this.searchMode = params['mode'];
    if (params.hasOwnProperty('query')) this.ketcher_query = params['query'];
    if (params.hasOwnProperty('tanimoto')) this.tanimotoThresh = params['tanimoto'];

    // look for pass back of the structure SMILES string
    this.structureSubscription = structSvc.smilesAnnounced$.subscribe(
      struct => {
        this.ketcher_query = struct;
        this.text_query = struct;
        console.log('this.text_query')
        console.log(this.text_query)
        // console.log(this.ketcher_query)
      });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.structureSubscription.unsubscribe();
  }

  onSubmit() {
    // tell ketcher that submit button has been pressed, so it can send back the SMILES structure
    this.submitted = true;
    this.structSvc.announceSubmit(true);

    this.submitQuery();
  }

  submitQuery() {
    if (this.submitted) {
      if (!this.ketcher_query && this.text_query) {
        this.ketcher_query = this.text_query;
      } else {
        this.text_query = this.ketcher_query;
      }

      let query = {
        query: this.ketcher_query,
        type: 'structure',
        mode: this.searchMode,
      };

      if (this.searchMode === 'similarity') {
        query['tanimoto'] = this.tanimotoThresh;
      }

      this.router.navigate(['search/'], {
        queryParams: query

      });
    }
  }

}
