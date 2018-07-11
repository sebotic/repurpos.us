import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-available-data',
  templateUrl: './available-data.component.html',
  styleUrls: ['./available-data.component.scss']
})
export class AvailableDataComponent implements OnInit {
  @Input() availData: Object[];

  constructor() { }

  ngOnInit() {
  }

}
