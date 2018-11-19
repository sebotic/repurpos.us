import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  current_year: number;

  constructor() {
    this.current_year = (new Date()).getFullYear();
  }

  ngOnInit() {
  }

}
