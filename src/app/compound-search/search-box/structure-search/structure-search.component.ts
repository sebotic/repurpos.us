import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { StructureService } from '../../../_services/index';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.css']
})

export class StructureSearchComponent implements OnInit {
  // structureQuery: string;
  panelOpenState: boolean = true;
  pressed: boolean = false;
  molfile: string;

  submitSubscription: Subscription;


  examples: Array<any> = [
    { 'type': 'structure',  'mode': 'exact', 'query': 'C1=C(C=CC(O)=C1)NC(=O)C', 'label': 'exact search', 'description': 'acetaminophen (Tylenol)' },
    { 'type': 'structure', 'molfile': "C1=CC=C2C(=C1)C(=CN2)CC(C(=O)O)NC(=O)CCC(C(=O)O)N", 'mode': 'stereofree', 'query': 'C1=CC=C2C(=C1)C(=CN2)CC(C(=O)O)NC(=O)CCC(C(=O)O)N', 'label': 'stereo-free exact search', 'description': 'orilotimod stereoisomers' },
    { 'type': 'structure', 'mode': 'similarity', 'tanimoto': 0.35, 'query': 'C(C1C2=C(N(C)N=1)C1=C(C=NC(=N1)NC1=CC=C(N3CCN(C)CC3)C=C1)CC2)(=O)N', 'label': 'similarity search', 'description': 'milciclib backbone' }
  ]

  constructor(private structSvc: StructureService, private route: ActivatedRoute) {
    // check if a query has been submitted
    console.log(route.queryParams['_value'])
    let params = route.queryParams['_value'];
    if (params.hasOwnProperty('query')) structSvc.announceSmiles(params['query'])

    // service to check if the submit button has been pressed.
    this.submitSubscription = structSvc.submitPressed$.subscribe(pressedStatus => {
      if (pressedStatus) {
        this.pressed = true;
        this.panelOpenState = false;
      }
    })

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
  }



}
