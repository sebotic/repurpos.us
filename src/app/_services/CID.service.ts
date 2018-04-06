import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CIDService {
  private newCIDSource = new Subject<string>();

  newCID$ = this.newCIDSource.asObservable();

  announceNewCID(cid: string) {
    this.newCIDSource.next(cid);
    // console.log(result);
  }
}