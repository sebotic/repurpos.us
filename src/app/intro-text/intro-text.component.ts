import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro-text',
  templateUrl: './intro-text.component.html',
  styleUrls: ['./intro-text.component.scss']
})
export class IntroTextComponent implements OnInit {
  reframe_pmid: string = "30282735";

  constructor() { }

  ngOnInit() {
  }

}
