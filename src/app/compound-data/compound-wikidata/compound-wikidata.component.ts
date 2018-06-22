import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compound-wikidata',
  templateUrl: './compound-wikidata.component.html',
  styleUrls: ['./compound-wikidata.component.css']
})

export class CompoundWikidataComponent implements OnInit {
  @Input() table_data: Array<Object> = [];
  @Input() qid: string;

  constructor() { }

  ngOnInit() {
  }

}
