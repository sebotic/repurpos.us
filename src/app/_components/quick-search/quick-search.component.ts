import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
})
export class QuickSearchComponent implements OnInit {
  query: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onEnter() {
    let curr_query = this.query;
    // reset query
    this.query = '';
    this.router.navigate(['search/'], {
      queryParams:
        {
          query: curr_query,
          type: 'string'
        }
    });
  }

}
