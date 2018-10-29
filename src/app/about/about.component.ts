import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  reframe_pmid = "30282735";

  constructor(private titleService: Title) {
   }

  ngOnInit() {
        this.titleService.setTitle("about | reframeDB");
  }

}
