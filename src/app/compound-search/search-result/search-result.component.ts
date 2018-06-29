import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	inputs: ['result'],
	outputs: ['sdata'],
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit{

  constructor(
	) {

  }

  ngOnInit(){
   }
}
