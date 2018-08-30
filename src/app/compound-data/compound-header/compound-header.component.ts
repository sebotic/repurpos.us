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

  public label: string;
  public aliases: Array<string> = [];
  public reframeCmpd: boolean;
  public whoName: string;
  public chemVendors: Array<Object> = [];
  public similarityResults: Array<Compound> = [];

  num_aliases: number;
  all_shown: boolean = false;
  alias_ct: number;


  constructor(private cmpdSvc: CompoundService) {
    this.getNumAliases();

    this.cmpdSvc.nameState.subscribe(cmpdName => {
      // console.log(cmpdName)
        this.label = cmpdName;
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
    if (this.all_shown) {
      this.alias_ct = this.num_aliases;
    } else {
      this.alias_ct = this.aliases.length;
    }
    this.all_shown = !this.all_shown;
  }

  getNumAliases() {
    // determine how many aliases to show
        if (window.screen.width > 800) {
          this.num_aliases = 15;
        } else {
          this.num_aliases = 5;
        }
        this.alias_ct = this.num_aliases;
  }

  onResize(event) {
    this.getNumAliases();
  }

}
