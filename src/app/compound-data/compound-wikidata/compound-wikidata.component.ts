import { Component, OnInit, Input } from '@angular/core';
import { CompoundService } from '../../_services/index';
import { WikiData } from '../../_models/vendor-data/index';

@Component({
  selector: 'app-compound-wikidata',
  templateUrl: './compound-wikidata.component.html',
  styleUrls: ['./compound-wikidata.component.scss']
})

export class CompoundWikidataComponent implements OnInit {
  private table_data: WikiData[] = [];
  private qid: string;

  constructor(private cmpdSvc: CompoundService) {

    this.cmpdSvc.qidState.subscribe((qid: string) => {
      this.qid = qid;
    })

    this.cmpdSvc.wikiTableState.subscribe((wdata: WikiData[]) => {
      this.table_data = wdata;
      console.log(wdata)
    })
  }

  ngOnInit() {
  }

}
