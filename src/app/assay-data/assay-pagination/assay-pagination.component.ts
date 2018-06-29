import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-assay-pagination',
  templateUrl: './assay-pagination.component.html',
  styleUrls: ['./assay-pagination.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssayPaginationComponent implements OnInit {
  // @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  @Input() private current_assay: string;
  @Input() private svg_height: number;

  @Output() currentPage: EventEmitter<number> = new EventEmitter<number>();
  @Output() numPerPage: EventEmitter<number> = new EventEmitter<number>();

  pages: Array<number>;
  num_per_page: number;
  pixels_per_cmpd: number = 40;
  current_page: number = 0;


  constructor() { }


  ngOnInit() {
    this.calcPages();
  }

  ngOnChanges() {
    this.calcPages();
  }


  calcPages() {
    // calculate number of compounds per page
    this.num_per_page = Math.round(this.svg_height / this.pixels_per_cmpd);
    this.numPerPage.emit(this.num_per_page);

    // calculate length of filtered data to generate pagination
    const filtered = this.data.filter(d => d.assay_type === this.current_assay);

    let num_cmpds = filtered.length;

    // calc number per page
    let num_pages = Math.ceil(num_cmpds / this.num_per_page);

    // create array of numbers from 0:num_pages
    this.pages = Array.apply(null, { length: num_pages }).map(Number.call, Number);
  }

  // On event detection with page change, switch the page number.
  switchPage(event) {
    this.current_page = Number(event.target.id);
    this.currentPage.emit(this.current_page);
  }

  // Helper if an IC/EC50 tab is pressed: resets page idx to 0.
  resetPage() {
    this.current_page = Number(0);
    this.currentPage.emit(0);
  }

}
