// Structural directive to embed json-ld object as a <script> tag within the body of the document.
// Mostly ported over from cvisb.org's implementation, minus the server-side rendering.
import { Directive, Renderer2, Inject, Input, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { AssayDetails } from '../_models/assay-details';

import { SchemaService } from './schema.service';

import { Schema } from '../_models/';

@Directive({
  selector: '[embedDatasetMetadata]'
})

export class EmbedDatasetMetadataDirective implements OnDestroy {
  script_element: any;


  @Input() set embedDatasetMetadata(jsonObj: AssayDetails) {
    let data2Embed: Schema = {
      'name': `${jsonObj.assay_title} assay data and protocol | ${environment.site_name}`,
      'description': jsonObj.purpose,
      "identifier": jsonObj.assay_id,
      // Following Google guidance as of 2020-01: https://developers.google.com/search/docs/data-types/dataset
      "citation": jsonObj.bibliography? `https://identifiers.org/pubmed:${jsonObj.bibliography}` : null,
      "variableMeasured": jsonObj.readout,

      // constants
      "inLanguage": "en",
      "@type": "Dataset",
      "@context": "http://schema.org/",
      "publisher": this.schemaSvc.publisher,
      "includedInDataCatalog": this.schemaSvc.dataCatalog,

      // requires some cleanup
      "distribution": this.schemaSvc.prepDistribution(jsonObj.assay_id),
      "creator": this.schemaSvc.prepAuthors(jsonObj.authors),
      "keywords": this.schemaSvc.prepKeywords(jsonObj),
      "measurementTechnique": this.schemaSvc.prepTechs(jsonObj.assay_type),

      // properties to add later, hopefully
      // "dateModified", "version",  "funder", "funding"
      // "license": this.schemaSvc.license,
    };

    data2Embed["url"] =  data2Embed.distribution[0].contentUrl;

    this._document.getElementsByTagName("script")
    this.script_element = this.renderer.createElement('script');

    this.script_element.type = `application/ld+json`;
    this.script_element.text = JSON.stringify(data2Embed);
    this.script_element.title = `schema.org Dataset`;
    this.script_element.id = `Dataset-${data2Embed['name']}`
    this.renderer.appendChild(this._document.head, this.script_element);
  }

  constructor(private renderer: Renderer2,
    private schemaSvc: SchemaService,
    @Inject(DOCUMENT) private _document) { }

  // Clean up past additions to the page
  ngOnDestroy(): void {
    // NOTE: should also happen server-side
    // if (this.script_element) {
    //   this.renderer.removeChild(this._document.head, this.script_element);
    // }
  }
}
