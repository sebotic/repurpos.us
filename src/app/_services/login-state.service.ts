import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs';

import { LoginState } from '../_models/index';

@Injectable()
export class LoginStateService {

	private loginSubject = new Subject<LoginState>();
	loginState = this.loginSubject.asObservable();
	public isUserLoggedIn: BehaviorSubject<LoginState> = new BehaviorSubject<LoginState>({loggedIn: false});

  constructor() { }

  loggedIn() {
		// console.log('logging in')
  	this.loginSubject.next(<LoginState>{loggedIn: true});
  	this.isUserLoggedIn.next(<LoginState>{loggedIn: true});
  }

  loggedOut() {
		// console.log('logging out')
  	this.loginSubject.next(<LoginState>{loggedIn: false});
  }

}
