import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-assay-pagination',
  templateUrl: './assay-pagination.component.html',
  styleUrls: ['./assay-pagination.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssayPaginationComponent implements OnInit {
  @Input() private data: Array<any>;
  @Input() private current_assay: string;

  @Output() currentPage: EventEmitter<number> = new EventEmitter<number>();

  pages: Array<number>;
  num_per_page: number = 15;
  current_page: number = 0;

  constructor() { }

  ngOnInit() {
    this.calcPages();
  }

  ngOnChanges() {
    console.log("CHANGED")
    this.calcPages();
  }

  calcPages() {
    console.log(this.current_assay)

    // calculate length of filtered data to generate pagination
    const filtered = this.data.filter(d => d.assay_type === this.current_assay);

    let num_cmpds = filtered.length;
    console.log(num_cmpds)

    // calc number per page
    let num_pages = Math.ceil(num_cmpds / this.num_per_page);
    this.pages = Array.apply(null, {length: num_pages}).map(Number.call, Number);
    console.log(this.pages)
  }


  switchPage(event) {
    this.current_page = Number(event.target.id);
    this.currentPage.emit(this.current_page);
  }

}
