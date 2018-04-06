import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GraphDataService {
  // Observable string sources
  private newGraphDataSource = new Subject<any>();

  // Observable string streams
  newGraphData$ = this.newGraphDataSource.asObservable();

  // Service message commands
  announceGraphData(data: any) {
    this.newGraphDataSource.next(data);
    console.log(data);
  }
}