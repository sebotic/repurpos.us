import { Component, OnInit, OnChanges, ElementRef, Input, ViewEncapsulation } from '@angular/core';
// import * as d3 from 'd3';

@Component({
  selector: 'app-cmpd-tooltip',
  templateUrl: './cmpd-tooltip.component.html',
  styleUrls: ['./cmpd-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CmpdTooltipComponent implements OnInit {
  @Input() public dataObj: any;
  private data: any;
  private left_coord: string;
  private top_coord: string;
  // imgURL: string;

  constructor() { }

  ngOnInit() {
    if (this.dataObj.on) {
      this.data = this.dataObj.data;

      // if (this.data.pubchem_id) {
      //   this.imgURL = "../assets/struct_img/" + this.data.pubchem_id.replace("CID", "") + ".png";
      // }

      // find position of the tooltip
      this.left_coord = String(this.dataObj.x) + 'px'
      this.top_coord = String(this.dataObj.y) + 'px'
    }
  }

  ngOnChanges() {
    if (this.dataObj.on) {
      this.data = this.dataObj.data;

      // if (this.data.pubchem_id) {
      //   this.imgURL = "../assets/struct_img/" + this.data.pubchem_id.replace("CID", "") + ".png";
      // }

      // find position of the tooltip
      this.left_coord = String(this.dataObj.x) + 'px'
      this.top_coord = String(this.dataObj.y) + 'px'
    }
  }

}
