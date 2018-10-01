import { Component, OnInit, Input } from '@angular/core';

import { CitationService } from '../_services/index';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})

export class CitationComponent implements OnInit {
  @Input() pmid: string;
  citations: any = [];
  // example from PMID
  // [{ "source": "PMC", "accessed": { "date-parts": [[2018, 8, 31]] }, "id": "aiid:5310922", "title": "A high-throughput phenotypic screen identifies clofazimine as a potential treatment for cryptosporidiosis", "author": [{ "family": "Love", "given": "Melissa S." }, { "family": "Beasley", "given": "Federico C." }, { "family": "Jumani", "given": "Rajiv S." }, { "family": "Wright", "given": "Timothy M." }, { "family": "Chatterjee", "given": "Arnab K." }, { "family": "Huston", "given": "Christopher D." }, { "family": "Schultz", "given": "Peter G." }, { "family": "McNamara", "given": "Case W." }], "editor": [{ "family": "Geary", "given": "Timothy G." }], "container-title-short": "PLoS Negl Trop Dis", "container-title": "PLoS Neglected Tropical Diseases", "publisher": "Public Library of Science", "publisher-place": "San Francisco, CA USA", "ISSN": "1935-2727", "issued": { "date-parts": [[2017, 2]] }, "page": "e0005373", "volume": "11", "issue": "2", "PMID": "28158186", "PMCID": "PMC5310922", "DOI": "10.1371/journal.pntd.0005373", "type": "article-journal" }];
  pmids: string[];

  constructor(private citeSvc: CitationService) {
  }

  ngOnInit() {

    if (this.pmid) {
      this.pmids = String(this.pmid).replace(" ", "").split(",");

      this.citeSvc.getCitation(this.pmids).then(vals => {
        this.citations = vals;
      })
    }

  }

}
