import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

import { environment } from '../../../environments/environment';

import { Subscription } from 'rxjs/subscription';
import { AssayDataService } from '../../_services';

@Component({
  selector: 'app-assay-dwnld',
  templateUrl: './assay-dwnld.component.html',
  styleUrls: ['./assay-dwnld.component.scss']
})

export class AssayDwnldComponent {
  private data: Array<any>;
  @Input() private assay_title: string;

  private today: string;
  private dataSubscription: Subscription;

  constructor(private assaySvc: AssayDataService, private datePipe: DatePipe) {
    this.dataSubscription = this.assaySvc.flatAssayDataSubject$.subscribe(data => {
      this.data = data;
    })

    this.today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  // Manual dictionary to translate
  colnames_dict = {
    "ac50": "ac50_value", "assay_title": "assay_title", "assay_type": "assay_type(IC_or_EC)", "calibr_id": "InChIkey",
    "efficacy": "efficacy", "name": "compound_name", "pubchem_id": "pubchem_id", "r_sq": "r_squared", "url": "reframedb_url"
  }

  // download function from https://code-maven.com/create-and-download-csv-with-javascript
  // and https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
  dwnldTSV = function() {
    this.prepData();

    const columnDelimiter = '\t'; // technically, tab-separated, since some chemical cmpds have commas in names.
    const lineDelimiter = '\n';

    let colnames = Object.keys(this.data[0]);
    let colnames_transformed = colnames.map(d => this.colnames_dict[d] || d) // convert to their longer name, if they have one. If not, return the existing value

    var dwnld_data = '';
    dwnld_data += colnames_transformed.join(columnDelimiter);
    dwnld_data += lineDelimiter;

    this.data.forEach(function(item) {
      let counter = 0;
      colnames.forEach(function(key) {
        if (counter > 0) dwnld_data += columnDelimiter;

        dwnld_data += item[key];
        counter++;
      });
      dwnld_data += lineDelimiter;
    });

    save_data(dwnld_data, 'tsv', this.assay_title, this.today)
  }

  dwnldJSON() {
    this.prepData();
    const dwnld_data = JSON.stringify(this.data)

    save_data(dwnld_data, 'json', this.assay_title, this.today)

  }

  prepData() {
    // append the URL
    // Also get rid of the /#/ in the URL...
    this.data.forEach(item => {
      item['url'] = (environment.host_url + item['url']).replace("/#/", "/");
    })
  }

}

function save_data(dwnld_data, file_type, assay_title, today) {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
  hiddenElement.target = '_blank';

  if (assay_title) {
    assay_title = assay_title.replace(/\s/g, '-') + "_";
  }

  hiddenElement.download = `${assay_title}reframedb-data_${today}.${file_type}`;
  // Gotta actually append the hidden element to the DOM for the click to work in Firefox
  // https://support.mozilla.org/en-US/questions/968992
  document.body.appendChild(hiddenElement);
  hiddenElement.click();
}
