import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-cmpd-tooltip',
  templateUrl: './cmpd-tooltip.component.html',
  styleUrls: ['./cmpd-tooltip.component.scss']
})

export class CmpdTooltipComponent implements OnInit {
  @Input() public dataObj: any;
  private data: any;
  private left_coord: string;
  private top_coord: string;

  constructor() { }

  ngOnInit() {
    if (this.dataObj.on) {
      this.data = this.dataObj.data;

      // find position of the tooltip
      this.left_coord = String(this.dataObj.x) + 'px'
      this.top_coord = String(this.dataObj.y) + 'px'
    }
  }

  ngOnChanges() {
    if (this.dataObj.on) {
      this.data = this.dataObj.data;

      // find position of the tooltip
      this.left_coord = String(this.dataObj.x) + 'px'
      this.top_coord = String(this.dataObj.y) + 'px'
    }
  }

}
