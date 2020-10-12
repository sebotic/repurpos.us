import { Component, OnInit } from '@angular/core';

import { PrimaryScreenData } from '../../_models/index';
import { CompoundService, ColorPaletteService } from '../../_services';

@Component({
  selector: 'app-primary-screening-data',
  templateUrl: './compound-primary-screening-data.component.html',
  styleUrls: ['./compound-primary-screening-data.component.scss']
})
export class CompoundPrimaryScreeningDataComponent implements OnInit {
  primaryData: Array<PrimaryScreenData> = [];

  constructor(private cmpdSvc: CompoundService, public colorSvc: ColorPaletteService) { }

  ngOnInit() {
    this.cmpdSvc.primaryDataState.subscribe((pd: PrimaryScreenData[]) => {
      this.primaryData = pd;

    })
  }

}
