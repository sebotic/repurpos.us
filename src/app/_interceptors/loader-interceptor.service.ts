import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/do';
import { MatDialog } from '@angular/material';

import { LoaderStateService } from '../_services/loader-state.service';

@Injectable()
export class LoaderInterceptorService implements HttpInterceptor {
	dialogRef: any;

  constructor(private loaderService: LoaderStateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	this.showLoader();

  	return next.handle(req).do((event: HttpEvent<any>) => {
  		if (event instanceof HttpResponse) {
  			this.hideLoader();
  		}
  	}, (err: any) => {
  		this.hideLoader();
  		console.log('loading complete with err');
  	});
  }

  private showLoader(): void {
  	this.loaderService.show();
  }

  private hideLoader(): void {
  	this.loaderService.hide();
  }

}
