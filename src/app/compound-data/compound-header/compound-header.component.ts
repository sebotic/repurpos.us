import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { CompoundService } from '../../_services/index';

import { Compound } from '../../_models';

@Component({
  selector: 'app-compound-header',
  templateUrl: './compound-header.component.html',
  styleUrls: ['./compound-header.component.scss']
})

export class CompoundHeaderComponent implements OnInit {
    @Input() results_per_page: number;
    @Input() _location: Location;

  private label: string;
  private aliases: Array<string> = [];
  private reframeCmpd: boolean;
  private whoName: string;
  private chemVendors: Array<Object> = [];
  private similarityResults: Array<Compound> = [];

  num_aliases: number = 15;
  alias_ct: number = this.num_aliases;


  constructor(private cmpdSvc: CompoundService) {

    this.cmpdSvc.nameState.subscribe(cmpdName => {
      if (cmpdName) {
        this.label = cmpdName;
      }
    })

    this.cmpdSvc.rfmState.subscribe((rfm: boolean) => {
      this.reframeCmpd = rfm;
    })

    this.cmpdSvc.whoState.subscribe((who: string) => {
      this.whoName = who;
    })

    this.cmpdSvc.aliasState.subscribe((aliasList: string[]) => {
      this.aliases = aliasList;
    })

    this.cmpdSvc.chemSourceState.subscribe((sources: Object[]) => {
      this.chemVendors = sources;
    })

    this.cmpdSvc.similarState.subscribe((sdata: Compound[]) => {
      this.similarityResults = sdata;
    })
  }


  onAnchorClick(anchor_tag: string) {
    let anchor_div = document.querySelector("#" + anchor_tag);
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
    this.alias_ct = this.aliases.length;
  }

}
