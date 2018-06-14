import { Component, OnInit, OnChanges, Input } from '@angular/core';

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

  ngOnChanges() {
    console.log(this.gvkData[0])
    console.log(this.integrityData[0])
    console.log(this.informaData[0])
  }

}
