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
  assayMin: number;

  constructor(private cmpdSvc: CompoundService) {

      this.cmpdSvc.assaysState.subscribe((assays: AssayData[]) => {
        this.assayData = assays.sort((a: any, b:any) => a.ac50 - b.ac50);

        this.assayMin = Math.min(... assays.map((d:any) => d.ac50));
        // console.log(this.assayMin)
        // this.assayMin = 1.27e-7;
      })

  }

  ngOnInit() {
  }

}
