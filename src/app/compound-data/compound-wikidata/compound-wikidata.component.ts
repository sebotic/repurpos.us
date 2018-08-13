import { Component, OnInit, Input } from '@angular/core';
import { CompoundService } from '../../_services/index';
import { WikiData } from '../../_models/vendor-data/index';

@Component({
  selector: 'app-compound-wikidata',
  templateUrl: './compound-wikidata.component.html',
  styleUrls: ['./compound-wikidata.component.scss']
})

export class CompoundWikidataComponent implements OnInit {
  public table_data: WikiData[] = [];
  public qid: string;

  constructor(private cmpdSvc: CompoundService) {

    this.cmpdSvc.idStates.subscribe((ids: Object) => {
      this.qid = ids['qid'];
    })

    this.cmpdSvc.wikiTableState.subscribe((wdata: WikiData[]) => {
      this.table_data = wdata;
      // console.log(wdata)
    })
  }

  ngOnInit() {
  }

}
