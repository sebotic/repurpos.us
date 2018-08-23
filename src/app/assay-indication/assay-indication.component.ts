import { Component, OnInit, Input } from '@angular/core';

import { BackendSearchService, SearchResultService, TanimotoScaleService, ColorPaletteService } from '../_services/index';


@Component({
  selector: 'app-assay-indication',
  templateUrl: './assay-indication.component.html',
  styleUrls: ['./assay-indication.component.scss']
})
export class AssayIndicationComponent implements OnInit {
  @Input() assay_name: string;
  // indic: string[] = ["Zika", "Malaria", "M. tuberculosis", "Helminth: anti-Wolbachia", "Cryptosporidium", '']
  @Input() assay_type: string ;
  @Input() assay_link: string;

  constructor(private colorSvc: ColorPaletteService,) { }

  ngOnInit() {
    // let rand = Math.floor(Math.random() * 6);
    // this.assay_type = this.indic[rand];
  }

}
