/*
 * Need to keep track of the state so the loader isn't opened twice
 */
import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LoaderState } from '../_models/index';

@Injectable()
export class LoaderStateService {

  private loaderSubect = new Subject<LoaderState>();
  loaderState = this.loaderSubect.asObservable();

  constructor(private ngZone: NgZone) { }

  show(counter: number) {
    this.ngZone.run(() => this.loaderSubect.next(<LoaderState>{ show: counter }));
  }

  hide(counter: number) {
    this.ngZone.run(() => this.loaderSubect.next(<LoaderState>{ show: counter }));
  }

}
