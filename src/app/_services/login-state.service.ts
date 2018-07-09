import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';

import { LoginState } from '../_models/index';

@Injectable()
export class LoginStateService {

	private loginSubject = new Subject<LoginState>();
	loginState = this.loginSubject.asObservable();
	public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  loggedIn() {
  	this.loginSubject.next(<LoginState>{loggedIn: true});
  }

  loggedOut() {
  	this.loginSubject.next(<LoginState>{loggedIn: false});
  }

}
