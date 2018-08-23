import { Component } from '@angular/core';

@Component({
  selector: 'app-compound-search',
  templateUrl: './compound-search.component.html',
  styleUrls: ['./compound-search.component.scss']
})
export class CompoundSearchComponent {
  isIE: boolean;

  constructor() {
  	let ua = window.navigator.userAgent;
  	let msie = ua.indexOf('MSIE ');
  	this.isIE = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
  }

}
