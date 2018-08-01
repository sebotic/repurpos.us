import { Component, OnInit, Input } from '@angular/core';

import { AssayData } from '../../_models/index';
import { CompoundService } from '../../_services/index';

@Component({
  selector: 'app-compound-assay-data',
  templateUrl: './compound-assay-data.component.html',
  styleUrls: ['./compound-assay-data.component.scss']
})

export class CompoundAssayDataComponent implements OnInit {
  assayData: Array<AssayData> = [];

  constructor(private cmpdSvc: CompoundService) {

      this.cmpdSvc.assaysState.subscribe((assays: AssayData[]) => {
        this.assayData = assays;
      })

  }

  ngOnInit() {
  }

}
