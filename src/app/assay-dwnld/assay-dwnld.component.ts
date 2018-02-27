import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
// import * as d3 from 'd3';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assay-dwnld',
  templateUrl: './assay-dwnld.component.html',
  styleUrls: ['./assay-dwnld.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AssayDwnldComponent {
  @Input() private data: Array<any>;

  // download function from https://code-maven.com/create-and-download-csv-with-javascript
  // and https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
  dwnldTSV() {
    const assay_title = 'assay'

    const columnDelimiter = '\t'; // technically, tab-separated, since some chemical cmpds have commas in names.
        const lineDelimiter = '\n';

        const colnames = Object.keys(this.data[0]);

        var dwnld_data = '';
        dwnld_data += colnames.join(columnDelimiter);
        dwnld_data += lineDelimiter;

        this.data.forEach(function(item) {
            let counter = 0;
            colnames.forEach(function(key) {
                if (counter > 0) dwnld_data += columnDelimiter;

                dwnld_data += item[key];
                counter ++;
            });
            dwnld_data += lineDelimiter;
        });


    save_data(dwnld_data, 'tsv', assay_title)
  }

  dwnldJSON() {
    const assay_title = 'assay'
    const dwnld_data = JSON.stringify(this.data)

    save_data(dwnld_data, 'json', assay_title)

  }

}

function save_data(dwnld_data, file_type, assay_title) {
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/tsv;charset=utf-8,' + encodeURI(dwnld_data);
  hiddenElement.target = '_blank';
  hiddenElement.download = assay_title.replace(/\s/g, '') + 'data.' + file_type;
  hiddenElement.click();
}
