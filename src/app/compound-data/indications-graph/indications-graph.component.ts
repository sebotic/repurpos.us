import {Component, Injectable, Input, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";

import { GraphDataService, SearchResultService } from "../../_services/index";

@Component({
  selector: 'app-indications-graph',
  templateUrl: './indications-graph.component.html',
  styleUrls: ['./indications-graph.component.css']
})

export class IndicationsGraphComponent {
  @Input() sdata;

  graphData = {
    nodes: [
      {data: {id: 'j', name: 'Jerry', faveColor: '#6FB1FC', faveShape: 'triangle'}},
      {data: {id: 'e', name: 'Elaine', faveColor: '#EDA1ED', faveShape: 'ellipse'}},
      {data: {id: 'k', name: 'Kramer', faveColor: '#86B342', faveShape: 'octagon'}},
      {data: {id: 'g', name: 'George', faveColor: '#F5A45D', faveShape: 'rectangle'}}
    ],
    edges: [
      {data: {source: 'j', target: 'e', faveColor: '#6FB1FC'}},
      {data: {source: 'j', target: 'k', faveColor: '#6FB1FC'}},
      {data: {source: 'j', target: 'g', faveColor: '#6FB1FC'}},

      {data: {source: 'e', target: 'j', faveColor: '#EDA1ED'}},
      {data: {source: 'e', target: 'k', faveColor: '#EDA1ED'}},

      {data: {source: 'k', target: 'j', faveColor: '#86B342'}},
      {data: {source: 'k', target: 'e', faveColor: '#86B342'}},
      {data: {source: 'k', target: 'g', faveColor: '#86B342'}},

      {data: {source: 'g', target: 'j', faveColor: '#F5A45D'}}
    ]
  };

  constructor(private searchResultService: SearchResultService, public graphDataService: GraphDataService) {
    this.searchResultService.newSearchResult$.subscribe(
      result => {
        this.sdata = result;
      });
    console.log("graph-class is the emitter" + this.sdata);
  }

}

