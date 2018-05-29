import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-structure-search-options',
  templateUrl: './structure-search-options.component.html',
  styleUrls: ['./structure-search-options.component.css']
})
export class StructureSearchOptionsComponent implements OnInit {

  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereo', 'label': 'stereofree exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'tanimoto', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]

  searchMode: string = 'exact';

  constructor() { }

  ngOnInit() {
  }

}
