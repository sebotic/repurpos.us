import { Component, OnInit, OnChanges, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-assay-type-btn',
  templateUrl: './assay-type-btn.component.html',
  styleUrls: ['./assay-type-btn.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssayTypeBtnComponent implements OnInit {
  @Input() private assay_types: Array<string>;
  @Output() assayChanged: EventEmitter<string> = new EventEmitter<string>();
  current_assay: string;

  constructor() { }

  ngOnInit() {
    const tabs = d3.select('#tabs');

    // set current assay: default == largest number of assays
    if (!this.current_assay) {
      this.current_assay = this.assay_types[0];
    }

    if (this.assay_types.includes('IC')) {
      tabs.select("#IC").style("display", "block")
    } else {
      tabs.select("#IC").style("display", "none")
    }

    if (this.assay_types.includes('EC')) {
      tabs.select("#EC").style("display", "block")
    } else {
      tabs.select("#EC").style("display", "none")
    }
  }

  ngOnChanges() {
    const tabs = d3.select('#tabs');
    // set current tab to be active
    if (this.current_assay == 'EC') {
      tabs.select('#EC').classed('active', true);
      tabs.select('#IC').classed('active', false);
    } else {
      tabs.select('#IC').classed('active', true);
      tabs.select('#EC').classed('active', false);
    }
  }

  switchAssay(event) {
    this.assayChanged.emit(event.target.id);

    this.current_assay = event.target.id;

    this.ngOnChanges();

  }

}
