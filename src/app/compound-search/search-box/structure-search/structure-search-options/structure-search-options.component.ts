import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { StructureService } from '../../../../_services/index';

@Component({
  selector: 'app-structure-search-options',
  templateUrl: './structure-search-options.component.html',
  styleUrls: ['./structure-search-options.component.css']
})
export class StructureSearchOptionsComponent implements OnInit {
  @Input() structure_query: string;
  @Input() searchQuery: string;
  structureSubscription: Subscription;

  // initial options + placeholders to save from user input
  searchMode: string = 'exact';
  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereofree', 'label': 'stereo-free exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'similarity', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]



  constructor(private router: Router, private structSvc: StructureService) {

    // look for pass back of the structure SMILES string
    this.structureSubscription = structSvc.structureAnnounced$.subscribe(
      struct => {
        this.structure_query = struct;
      });

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.structureSubscription.unsubscribe();
  }

  onSubmit() {
    // tell ketcher that submit button has been pressed, so it can send back the SMILES structure
    this.structSvc.announceSubmit(true);

    if (!this.structure_query && this.searchQuery) {
      this.structure_query = this.searchQuery;
    }

    let query = {
      query: this.structure_query,
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
