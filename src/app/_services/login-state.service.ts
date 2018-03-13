import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/subject';

import { LoginState } from '../_models/index';

@Injectable()
export class LoginStateService {

	private loginSubject = new Subject<LoginState>();
	loginState = this.loginSubject.asObservable();

  constructor() { }

  loggedIn() {
  	this.loginSubject.next(<LoginState>{loggedIn: true});
  }

  loggedOut() {
  	this.loginSubject.next(<LoginState>{loggedIn: false});
  }

}
