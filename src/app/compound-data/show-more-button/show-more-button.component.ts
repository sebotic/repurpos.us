import {Component, Injectable, Input, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";


@Injectable()
@Component({
  styleUrls: ['./show-more-button.component.css'],
  selector: 'app-show-more-pane',
  template: `
    <div class="mat-app-background">
      <h4>More concepts having the same target</h4>
    <ol>
    <li>test 1</li>
    <li>test 2</li>
    <li>test 3</li>
  </ol>
    </div>`
})
export class ShowMorePane {

  name: string;

  constructor(private http: HttpClient) {}

  submitData(): void {
    this.http.post('http://localhost:5000/write', {
        'id': this.name,

      }, {
        observe: 'response',
        withCredentials: true,
        params: new HttpParams()
          .set('origin', 'https://repurpos.us')
          .set('action', 'wbeditentity')
          .set('format', 'json')
        ,

        headers: new HttpHeaders()
        // .set('Authorization', this.auth_creds)
          .set('content-type', 'application/json')
          .set('charset', 'utf-8'),
      }

    ).subscribe((re) => {
        console.log(JSON.stringify(re));
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
        console.log(JSON.stringify(err));
        console.log(err.status);
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

  constructor() {  }

  ngOnInit() {
  }

  showMore(clickEvent): void {
    console.log('click workds', clickEvent);
    // let elementID: string = clickEvent.srcElement.id;
    console.log( this.qid);

    this.displayShowMorePane = !this.displayShowMorePane;
  }


}
