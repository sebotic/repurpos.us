import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.css']
})
export class TextSearchComponent implements OnInit {
  @Input() searchQuery: string;

  examples: Array<any> = [
    { 'type': 'string', 'query': 'imatinib%20mesylate', 'description': 'drug search: imatinib mesylate' },
    { 'type': 'string', 'query': 'KKYABQBFGDZVNQ-UHFFFAOYSA-N', 'description': 'InChI key search: KKYABQBFGDZVNQ-UHFFFAOYSA-N' },
    { 'type': 'string', 'query': 'kinase', 'description': 'class search: kinases' },
    { 'type': 'string', 'query': 'malaria', 'description': 'class search: malaria' }
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.router.navigate(['search/'], {
      queryParams:
        { query: this.searchQuery,
          type: 'string'}
    });
  }

}
