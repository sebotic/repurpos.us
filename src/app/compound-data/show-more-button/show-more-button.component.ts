import {Component, Injectable, Input, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {WDQSData} from "../../_models/index";


@Injectable()
@Component({
  styleUrls: ['./show-more-button.component.css'],
  selector: 'app-show-more-pane',
  template: `
    <div class="mat-app-background">
      <h4>More compounds with the same property:</h4>
    <ul>
      <li *ngFor="let x of otherCompounds"><a href="/#/compound_data/{{x['c'].split('/').pop()}}" target="_blank">{{x['cLabel']}}</a> <sup>{{x['refDBLabel']}}</sup></li>
  </ul>
    </div>`
})
export class ShowMorePane implements OnInit {
  @Input() qid: string;
  @Input() pid: string;
  @Input() mainQID: string;

  otherCompounds: Array<Object> = [];

  constructor(private http: HttpClient)  {}

  ngOnInit(): void {
    console.log('within button pane', this.qid, this.pid);

    let query: string = `
      SELECT DISTINCT ?c ?cLabel ?refDB ?refDBLabel WHERE {
        ?c wdt:${this.pid} wd:${this.qid}  FILTER (?c != wd:${this.mainQID}) .
        ?c wdt:P31 wd:Q11173 .
        OPTIONAL { ?c p:${this.pid}/prov:wasDerivedFrom/pr:P248 ?refDB . }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
      }`;

    console.log(query);

    this.http.get<WDQSData>('https://query.wikidata.org/sparql',  {
        observe: 'response',
        params: new HttpParams()
          .set('query', query)
          .set('format', 'json'),
        headers: new HttpHeaders()
          .set('Accept', 'application/json')
      }

    ).subscribe(
      (re) => {
        let b = re.body;

        for (let i of b.results.bindings){
          let tmp = {};
          for(let v of b.head.vars) {

            if (i.hasOwnProperty(v)) {
              tmp[v] = i[v]['value'];
            }
          }
          this.otherCompounds.push(tmp);
        }
        console.log(this.otherCompounds);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
      },
       () => {
         console.log('query completed')
       }
    );
  }
}

@Component({
  selector: 'app-show-more-button',
  templateUrl: './show-more-button.component.html',
  styleUrls: ['./show-more-button.component.css']
})
export class ShowMoreButtonComponent implements OnInit {

  displayShowMorePane: boolean;
  @Input() qid: string;
  @Input() pid: string;
  @Input() mainQID: string;

  constructor() {  }

  ngOnInit() {
  }

  showMore(clickEvent): void {
    console.log('click workds', clickEvent);
    // let elementID: string = clickEvent.srcElement.id;
    console.log(this.qid, this.pid, this.mainQID);

    this.displayShowMorePane = !this.displayShowMorePane;
  }


}
