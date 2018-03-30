import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent implements OnInit {
	query: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onEnter() {
  	this.router.navigate([''], {queryParams: {query: this.query}});
  }

}
