import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-structure-search-options',
  templateUrl: './structure-search-options.component.html',
  styleUrls: ['./structure-search-options.component.css']
})
export class StructureSearchOptionsComponent implements OnInit {
  @Input() structure_query: string;

  // initial options + placeholders to save from user input
  searchMode: string = 'exact';
  tanimotoThresh: number = 0.85;

  searchOptions: any = [
    { 'id': 'exact', 'label': 'exact match', 'tooltip': 'search only exact matches' },
    { 'id': 'stereofree', 'label': 'stereo-free exact match', 'tooltip': 'ignoring stereochemistry, return only exact matches' },
    { 'id': 'similarity', 'label': 'search similar compounds', 'tooltip': 'search based on a Tanimoto similarity score' }
  ]



  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log('input structure:')
    console.log(this.structure_query);

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
