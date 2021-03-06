import { Component, OnInit, Input } from '@angular/core';

import { AvailableData } from '../../_models';

@Component({
  selector: 'app-available-data',
  templateUrl: './available-data.component.html',
  styleUrls: ['./available-data.component.scss']
})

export class AvailableDataComponent implements OnInit {
  @Input() availData: AvailableData[];
  private loggedIn: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
