import { Component, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';

import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
// import * as d3 from 'd3';

import { Subscription } from 'rxjs';
import { StructureService } from '../../../../_services/index';

@Component({
  selector: 'app-ketcher',
  templateUrl: './ketcher.component.html',
  styleUrls: ['./ketcher.component.css']
})

export class KetcherComponent implements OnInit {
  structQuery: string;
  iframe: any; // holder for ketcher HTML
  molfile: string; // if the structure is already specified...

  submitSubscription: Subscription;


  constructor(private domSanitizer: DomSanitizer, private structSvc: StructureService, private elRef: ElementRef) {
    // Service to insert the ketcher structure drawing module into an iframe
    // domSanitizer required to make sure the browser doesn't freak out about having html injected
    this.iframe = this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/ketcherv2/ketcher.html');
    // this.iframe = this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/ketcher/ketcher.html?ketcher_maximize');

    // service to check if molfile returned
    this.submitSubscription = structSvc.molfileAnnounced$.subscribe(molfile => {
      this.molfile = molfile;

      // Try to draw molfile (for when the molfile has changed)
      if (this.molfile) {
        this.setMol(this.molfile);
      }

    })



  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.querySelector("#ketcherFrame").addEventListener('load', this.onLoad.bind(this));
  }


  onLoad(e) {
    // wait till iframe is loaded to attach click event listener
    // NOTE: to get molfile loader to correctly ping, requires fanciness.  DOM element doesn't exist till open "open" button
    var iframeDiv = this.elRef.nativeElement.querySelector("#ketcherFrame");
    var iframeDocument = iframeDiv.contentDocument || iframeDiv.contentWindow.document;
    var iframeContent = iframeDocument.querySelectorAll('#canvas');


    iframeContent[0].addEventListener('click', this.onDraw.bind(this));
    iframeContent[0].addEventListener('mousedown', this.onDraw.bind(this));
    iframeContent[0].addEventListener('mouseup', this.onDraw.bind(this));
    // console.log(iframeContent)

    // If there's a molfile, draw it in the ketcher iframe. Gotta wait till ketcher is initialized
    if (this.molfile) {
      this.setMol(this.molfile);
    }

  }

  // Event listener if the drawing has changed
  onDraw() {
    // this.structSvc.announceDrawn(true);
    this.getSmiles();
    this.structSvc.announceSmiles(this.structQuery, false);
  }


  ngOnDestroy() {
    this.submitSubscription.unsubscribe();
  }

  getKetcher() {
    var frame = null;

    if ('frames' in window && 'ketcherFrame' in window.frames)
      frame = window.frames['ketcherFrame'];
    else
      return null;

    if ('window' in frame)
      return frame.window.ketcher;
  }

  getSmiles() {
    var ketcher = this.getKetcher();

    if (ketcher) {
      this.structQuery = ketcher.getSmiles();
    }
  }

  setMol(inputMol: string) {
    // console.log(inputMol)
    var ketcher = this.getKetcher();

    if (ketcher) {
      ketcher.setMolecule(inputMol);
    }
  }


}
