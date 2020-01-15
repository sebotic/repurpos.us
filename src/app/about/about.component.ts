import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent implements OnInit {
  reframe_pmid: string = "30282735";
  meta_tags = [
    { name: 'description', content: 'About ReframeDB, an open and extendable drug repurposing database and screening set of over 12,000 compounds' },
    { property: 'og:title', content: 'About ReframeDB' },
    { property: 'og:description', content: 'About ReframeDB, an open and extendable drug repurposing database and screening set of over 12,000 compounds' },
    { property: 'og:url', content: 'https://reframedb.org/about' }
  ];

  sections: Object[] = [
    { label: "overview", link: "overview" },
    { label: "library access", link: "partnerships" },
    { label: "citing", link: "citation" },
    { label: "sources", link: "sources" },
    { label: "terms", link: "terms" }
  ];
  private fragment: string;


  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta) {
    for (let i = 0; i < this.meta_tags.length; i++) {
      meta.updateTag(this.meta_tags[i]);
    }
    titleService.setTitle("about | reframeDB");
  }


  ngOnInit() {
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit(): void {
    this.scrollTo(this.fragment)
  }

  scrollTo(anchor) {
    try {
      document.querySelector('#' + anchor).scrollIntoView();
    } catch (e) { }
  }

}
