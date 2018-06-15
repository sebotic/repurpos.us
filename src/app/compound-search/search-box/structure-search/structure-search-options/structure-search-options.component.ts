import { Component, OnInit, OnChanges, AfterViewInit, Input, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  tmSubscription: Subscription;
  modeSubscription: Subscription;
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
    // look for pass back of the structure SMILES string
    this.structureSubscription = structSvc.smilesAnnounced$.subscribe(
      struct => {
        this.text_query = struct;
      });

    // look for pass back of input parameters
    this.modeSubscription = structSvc.modeAnnounced$.subscribe(
      mode => {
        console.log('service activated')
        console.log(mode)
        this.searchMode = mode;
      });

    this.tmSubscription = structSvc.tanimotoAnnounced$.subscribe(
      tm_thresh => {
        this.tanimotoThresh = tm_thresh;
      });

  }

  ngOnInit() {
    console.log('init')
    this.updateParams()
    console.log(this.searchMode)

  }

  ngOnChanges() {
    console.log('changes')
    console.log(this.searchMode)
  }

  ngAfterViewInit() {
    console.log('after')
    console.log(this.searchMode)
  }

  ngOnDestroy() {
    this.structureSubscription.unsubscribe();
    this.tmSubscription.unsubscribe();
    this.modeSubscription.unsubscribe();
  }

  // A bit klugey; for some reason, service doesn't work if the URL is pre-defined
  // Suspect some sort of async loading problem
  updateParams() {
    // console.log('updating params')
    // Update the params, based on the route, if needed
    let params = this.route.queryParams['_value'];
    if (params.hasOwnProperty('mode')) this.searchMode = params['mode'];
    if (params.hasOwnProperty('tanimoto')) this.tanimotoThresh = params['tanimoto'];
    if (params.hasOwnProperty('query')) {
      this.structSvc.announceSmiles(params['query'], true);
      // this.text_query = params['query'];
      // this.submitted = true;
      // this.submitQuery();
    };
  }

  onSubmit() {
    // tell ketcher that submit button has been pressed, so it can send back the SMILES structure
    this.submitted = true;
    // Announce the SMILES has changed, to grab the molfile to draw in ketcher
    this.structSvc.announceSmiles(this.text_query, true);

    this.submitQuery();
  }

  submitQuery() {
    if (this.submitted) {

      let query = {
        query: this.text_query,
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
