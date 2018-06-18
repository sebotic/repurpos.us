import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compound-wikidata-ids',
  templateUrl: './compound-wikidata-ids.component.html',
  styleUrls: ['./compound-wikidata-ids.component.css']
})
export class CompoundWikidataIdsComponent implements OnInit {
  @Input() qid: string;
  @Input() table_data: Array<Object> = [];
  @Input() idData: Array<Object> = [];
  @Input() gvkData: Object = [];
  @Input() informaData: Object = [];
  @Input() integrityData: Object = [];

  constructor() { }

  ngOnInit() {}

}
