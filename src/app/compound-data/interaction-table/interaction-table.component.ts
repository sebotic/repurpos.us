import { Component, ElementRef, EventEmitter, Injectable, Input, OnChanges } from '@angular/core';
import { DataTableResource } from '../../table/index';
import { Subject } from 'rxjs/Subject';

import {Router} from "@angular/router";

@Injectable()
export class InteractionTableDataService {
  // Observable string sources
  private newCompoundDataSource = new Subject<any>();

  // Observable string streams
  newCompoundData$ = this.newCompoundDataSource.asObservable();

  // Service message commands
  announceNewCompoundData(result: any) {
    this.newCompoundDataSource.next(result);
    console.log("annonce called", result);
  }
}

@Component({
  selector: 'app-interaction-table',
  templateUrl: './interaction-table.component.html',
  styleUrls: ['./interaction-table.component.css']
})
export class InteractionTableComponent implements OnChanges {

  @Input() sdata: any;

  itemResource;
  items = [];
  itemCount = 0;


  constructor(private el: ElementRef,
              private router: Router,
              private interactionTableDataService: InteractionTableDataService
  ) {


    this.interactionTableDataService.newCompoundData$.subscribe(
    result => {
      this.sdata = result;

      this.itemResource = new DataTableResource(this.sdata);
      this.itemResource.query({'limit': 10, 'offset': 0}).then(items => this.items = items);
      this.itemResource.count().then(count => this.itemCount = count);

    });

    // this.itemResource.count().then(count => this.itemCount = count);
  }

  reloadItems(params) {
    if(this.sdata) {
      // console.log('params', params);
      console.log('params', params);

      this.itemResource.query(params).then(items => this.items = items);
    }
  }

  rowClick(rowEvent) {

  }

  rowDoubleClick(rowEvent) {

  }

  rowTooltip(item) { return item.disease_name; }

  ngOnChanges() {
    this.itemResource = new DataTableResource(this.sdata);
    this.itemResource.count().then(count => this.itemCount = count);
  }
}
