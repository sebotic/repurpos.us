import { Component, OnInit, Input } from '@angular/core';

import { AssayData } from '../../_models/index';
import { CompoundService, ColorPaletteService } from '../../_services/index';

@Component({
  selector: 'app-compound-assay-data',
  templateUrl: './compound-assay-data.component.html',
  styleUrls: ['./compound-assay-data.component.scss']
})

export class CompoundAssayDataComponent implements OnInit {
  assayData: Array<AssayData> = [];
  assayMin: number;
  // assay_type: string;
  // indic: string[] = ["Zika", "Malaria", "M. tuberculosis", "Helminth: anti-Wolbachia", "Cryptosporidium", '']


  constructor(private cmpdSvc: CompoundService, private colorSvc: ColorPaletteService) {

    this.cmpdSvc.assaysState.subscribe((assays: AssayData[]) => {
      this.assayData = assays.sort((a: any, b: any) => a.ac50 - b.ac50);

      this.assayMin = Math.min(...assays.filter(d => d.ac50).map((d: any) => d.ac50));

    })

  }

  ngOnInit() {
    // let rand = Math.floor(Math.random() * 6);
    // this.assay_type = this.indic[rand];
  }

}
