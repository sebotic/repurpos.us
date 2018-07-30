import { Component, OnInit, Input } from '@angular/core';

import { AssayData, Compound, SearchResult, LoginState } from '../../_models/index';
import { LoginStateService, CompoundService } from '../../_services/index';

@Component({
  selector: 'app-compound-assay-data',
  templateUrl: './compound-assay-data.component.html',
  styleUrls: ['./compound-assay-data.component.scss']
})

export class CompoundAssayDataComponent implements OnInit {
  assayData: Array<AssayData> = [];
  // loggedIn: boolean;

  constructor(private loginStateService: LoginStateService, private cmpdSvc: CompoundService) {
    // this.loginStateService.isUserLoggedIn
    //   .subscribe((bstate: LoginState) => {
    //     // console.log('ASSAY DATA: subscribing to BehaviorSubject within SVC...')
    //     // console.log(bstate)
    //     this.loggedIn = bstate.loggedIn;
    //   });

      this.cmpdSvc.assaysState.subscribe((assays: AssayData[]) => {
        // console.log('ASSAY DATA: getting assay data')
        // console.log(assays)
        this.assayData = assays;

      })

  }

  ngOnInit() {
  }

}
