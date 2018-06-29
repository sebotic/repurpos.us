import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compound-assay-data',
  templateUrl: './compound-assay-data.component.html',
  styleUrls: ['./compound-assay-data.component.scss']
})

export class CompoundAssayDataComponent implements OnInit {
  @Input() assayData: Array<Object> = [];
  @Input() loggedIn: boolean;

  constructor() { }

  ngOnInit() {
  }

}
