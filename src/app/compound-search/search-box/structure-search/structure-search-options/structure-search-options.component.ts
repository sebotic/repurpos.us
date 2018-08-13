import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { StructureService, SearchResultService } from '../../../../_services/index';

@Component({
  selector: 'app-structure-search-options',
  templateUrl: './structure-search-options.component.html',
  styleUrls: ['./structure-search-options.component.scss']
})

export class StructureSearchOptionsComponent implements OnInit {
  ketcher_query: string;
  text_query: string;
  structureSubscription: Subscription;
  tmSubscription: Subscription;
  modeSubscription: Subscription;
  submitSubscription: Subscription;

  // initial options + placeholders to save from user input
  searchMode: string = 'exact';
  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereofree', 'label': 'stereo-free exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'similarity', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]

  examples: Array<any> = [
    { 'type': 'structure', 'mode': 'exact', 'query': 'C1=C(C=CC(O)=C1)NC(=O)C', 'label': 'exact search', 'description': 'acetaminophen (Tylenol)' },
    { 'type': 'structure', 'molfile': "C1=CC=C2C(=C1)C(=CN2)CC(C(=O)O)NC(=O)CCC(C(=O)O)N", 'mode': 'stereofree', 'query': 'C1=CC=C2C(=C1)C(=CN2)CC(C(=O)O)NC(=O)CCC(C(=O)O)N', 'label': 'stereo-free exact search', 'description': 'orilotimod stereoisomers' },
    { 'type': 'structure', 'mode': 'similarity', 'tanimoto': 0.35, 'query': 'C(C1C2=C(N(C)N=1)C1=C(C=NC(=N1)NC1=CC=C(N3CCN(C)CC3)C=C1)CC2)(=O)N', 'label': 'similarity search', 'description': 'milciclib backbone' }
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private structSvc: StructureService,
    private searchResultService: SearchResultService) {
    // look for pass back of the structure SMILES string
    this.structureSubscription = structSvc.smilesAnnounced$.subscribe(
      struct => {
        this.text_query = struct;
      });

    // look for pass back of input parameters
    this.modeSubscription = structSvc.modeAnnounced$.subscribe(
      mode => {
        this.searchMode = mode;
      });

    this.tmSubscription = structSvc.tanimotoAnnounced$.subscribe(
      tm_thresh => {
        this.tanimotoThresh = tm_thresh;
      });

  }

  ngOnInit() {
    this.updateParams()
  }

  ngOnDestroy() {
    this.structureSubscription.unsubscribe();
    this.tmSubscription.unsubscribe();
    this.modeSubscription.unsubscribe();
    this.submitSubscription.unsubscribe();
  }

  // A bit klugey; for some reason, service doesn't work if the URL is pre-defined
  // Suspect some sort of async loading problem
  updateParams() {
    // Update the params, based on the route, if needed
    let params = this.route.queryParams['_value'];
    if (params['type'] === 'structure') {
      if (params.hasOwnProperty('mode')) this.searchMode = params['mode'];
      if (params.hasOwnProperty('tanimoto')) this.tanimotoThresh = params['tanimoto'];
      if (params.hasOwnProperty('query')) {
        this.structSvc.announceSmiles(params['query']);
      };
    }
  }

  onChange() {
    // Announce the SMILES has changed, to grab the molfile to draw in ketcher
    this.structSvc.announceSmiles(this.text_query.trim());
    this.structSvc.getMolfile(this.text_query.trim());
  }

  onSubmit() {
    // Announce the SMILES has changed
    this.structSvc.announceSmiles(this.text_query.trim());

    this.structSvc.getMolfile(this.text_query.trim());

    // call backend to send back search results
    this.submitQuery();
  }

  submitQuery() {
    // check if structure has been submitted; needed to only launch search when TM changed after already searched
    // if (this.submitted) {
    let query = {
      query: this.text_query.trim(),
      type: 'structure',
      mode: this.searchMode,
    };

    if (this.searchMode === 'similarity') {
      query['tanimoto'] = this.tanimotoThresh;
    }

    // Update that search has been completed.
    this.searchResultService.announceSubmit(true);

    this.router.navigate(['search/'], {
      queryParams: query
    });
    // } else {
    // turn off results
    // this.hideResults();
    // }
  }


  hideResults() {
    this.searchResultService.announceSubmit(false);
  }


}
