import { Component, OnInit, Input } from '@angular/core';

import { BackendSearchService, SearchResultService, TanimotoScaleService, ColorPaletteService } from '../../../_services';


@Component({
  selector: 'app-assay-indication',
  templateUrl: './assay-indication.component.html',
  styleUrls: ['./assay-indication.component.scss']
})
export class AssayIndicationComponent implements OnInit {
  @Input() assay_name: string;
  @Input() assay_type: string;
  @Input() assay_link: string;

  constructor(private colorSvc: ColorPaletteService, ) { }

  ngOnInit() {
  }

}
