/*
 * Need to keep track of the state so the loader isn't opened twice
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/subject';

import { LoaderState } from '../_models/index';

@Injectable()
export class LoaderStateService {

	private loaderSubect = new Subject<LoaderState>();
	loaderState = this.loaderSubect.asObservable();

  constructor() { }

  show() {
  	this.loaderSubect.next(<LoaderState>{show: true});
  }

  hide() {
  	this.loaderSubect.next(<LoaderState>{show: false});
  }

}
