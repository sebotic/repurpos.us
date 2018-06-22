import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
// import { Router, ActivatedRoute } from '@angular/router';

import { SimilarityData } from '../../_models';

@Component({
  selector: 'app-compound-header',
  templateUrl: './compound-header.component.html',
  styleUrls: ['./compound-header.component.css']
})

export class CompoundHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() aliases: Array<string> = [];
  @Input() idData: Array<Object> = [];
  @Input() chemVendors: Array<Object> = [];
  @Input() integrityData: Object = [];
  @Input() results_per_page: number;
  @Input() similarityData: Array<SimilarityData>;
  @Input() _location: Location;

  num_aliases: number = 35;
  alias_ct: number = this.num_aliases;


  constructor() { }


  onAnchorClick(anchor_tag: string) {
    // console.log(anchor_tag)
    let anchor_div = document.querySelector("#" + anchor_tag);
    // console.log(x)
    if (anchor_div) {
      anchor_div.scrollIntoView();
    }
  }

  backClick() {
    this._location.back();
  }

  ngOnInit() {
  }

  showMore() {
    this.alias_ct += this.num_aliases;
  }

}
