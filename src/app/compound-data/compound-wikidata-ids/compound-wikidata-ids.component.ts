import { Component, OnInit, Input } from '@angular/core';


import { GVKData, IntegrityData, InformaData } from '../../_models/index';

@Component({
  selector: 'app-compound-wikidata-ids',
  templateUrl: './compound-wikidata-ids.component.html',
  styleUrls: ['./compound-wikidata-ids.component.scss']
})

export class CompoundWikidataIdsComponent implements OnInit {
  @Input() qid: string;
  @Input() table_data: Array<Object> = [];
  @Input() idData: Array<Object> = [];
  @Input() gvkData: GVKData;
  @Input() informaData: InformaData;
  @Input() integrityData: IntegrityData;

  constructor() { }

  ngOnInit() {
  }

}
