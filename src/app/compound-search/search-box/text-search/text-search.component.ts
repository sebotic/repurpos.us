import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss']
})
export class TextSearchComponent implements OnInit {
  @Input() searchQuery: string;

  examples: Array<any> = [
    { 'type': 'string', 'query': 'imatinib mesylate', 'label': 'drug search', 'description': 'imatinib mesylate' },
    { 'type': 'string', 'query': 'WXJFKKQWPMNTIM-VWLOTQADSA-N', 'label': 'InChI key search', 'description': 'brincidofovir' },
    { 'type': 'string', 'query': 'tyrosine kinase inhibitor', 'label': 'class search', 'description': 'tyrosine kinase inhibitor' },
    // { 'type': 'string', 'query': 'melanoma kinase', 'label': 'class search', 'description': 'melanoma kinases' },
    { 'type': 'string', 'query': 'glioblastoma', 'label': 'disease search', 'description': 'glioblastoma' }
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.router.navigate(['search'], {
      queryParams:
        { query: this.searchQuery,
          type: 'string'}
    });
  }

}
