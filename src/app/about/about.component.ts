import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent {
  reframe_pmid: string = "30282735";
  meta_tags = [
    { name: 'description', content: 'About reframeDB, an open and extendable drug repurposing database and screening set of 12,000 compounds' },
    { property: 'og:title', content: 'About reframeDB' },
    { property: 'og:description', content: 'About reframeDB, an open and extendable drug repurposing database and screening set of 12,000 compounds' },
    { property: 'og:url', content: 'https://reframedb.org/#/about' }
  ];

  constructor(private titleService: Title, private meta: Meta) {
    for(let i=0; i < this.meta_tags.length; i++){
      meta.updateTag(this.meta_tags[i]);
    }
    titleService.setTitle("about | reframeDB");
  }

}
