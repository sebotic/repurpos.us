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
  svg: any; // Element reference for Ketcher svg container

  // search: boolean = true; // whether on search page or compound page

  submitSubscription: Subscription;

  // milciclib_core: string = [
  //   "",
  //   "Ketcher  6131813262D 1   1.00000     0.00000     0",
  //   "",
  //   " 31 35  0     0  0            999 V2000",
  //   "    3.6456   -1.2314    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    3.7918   -2.0434    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    2.8693   -0.9521    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    9.2891    1.8322    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   10.1137    1.8064    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   10.5037    1.0794    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   10.0691    0.3782    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    9.2445    0.4040    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    8.8545    1.1310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    8.0299    1.1567    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    7.5953    0.4555    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    6.7707    0.4813    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    7.5506   -0.9728    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    7.9853   -0.2715    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    6.7260   -0.9470    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    6.3361   -0.2200    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    5.4668   -1.6225    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    6.2914   -1.6482    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    5.0769   -0.8955    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    5.5115   -0.1942    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    4.9788    0.4358    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    4.2151    0.1240    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    4.2756   -0.6988    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "    5.1755    1.2370    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   11.3283    1.0537    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   11.7629    1.7549    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   12.5875    1.7292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   12.9775    1.0022    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   12.5429    0.3009    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   11.7183    0.3267    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "   13.8021    0.9764    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
  //   "  9  4  1  0     0  0",
  //   " 15 18  1  0     0  0",
  //   " 16 20  1  0     0  0",
  //   " 19 17  1  0     0  0",
  //   " 17 18  1  0     0  0",
  //   " 19 20  2  0     0  0",
  //   "  1  3  1  0     0  0",
  //   "  9 10  1  0     0  0",
  //   "  5  6  1  0     0  0",
  //   " 10 11  1  0     0  0",
  //   "  1  2  2  0     0  0",
  //   " 20 21  1  0     0  0",
  //   " 21 22  1  0     0  0",
  //   " 22 23  2  0     0  0",
  //   " 23 19  1  0     0  0",
  //   " 11 12  2  0     0  0",
  //   " 21 24  1  0     0  0",
  //   " 23  1  1  0     0  0",
  //   " 25 26  1  0     0  0",
  //   " 12 16  1  0     0  0",
  //   "  6  7  2  0     0  0",
  //   " 15 13  1  0     0  0",
  //   " 13 14  2  0     0  0",
  //   " 14 11  1  0     0  0",
  //   " 25 30  1  0     0  0",
  //   " 26 27  1  0     0  0",
  //   " 27 28  1  0     0  0",
  //   " 28 29  1  0     0  0",
  //   " 29 30  1  0     0  0",
  //   "  6 25  1  0     0  0",
  //   " 15 16  2  0     0  0",
  //   " 28 31  1  0     0  0",
  //   "  7  8  1  0     0  0",
  //   "  4  5  2  0     0  0",
  //   "  8  9  2  0     0  0",
  //   "M  END"
  // ].join("\n");


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
    // NOTE: to get molfile load function to correctly ping, requires fanciness.  DOM element doesn't exist till open "open" button
    var iframeDiv = this.elRef.nativeElement.querySelector("#ketcherFrame");
    var iframeDocument = iframeDiv.contentDocument || iframeDiv.contentWindow.document;
    var iframeContent = iframeDocument.querySelectorAll('#canvas');
    this.svg = iframeContent[0];
    var ketcherContent = iframeDocument.querySelectorAll('main > menu');

    // if (this.search) {
    this.svg.addEventListener('click', this.onDraw.bind(this));
    this.svg.addEventListener('mousedown', this.onDraw.bind(this));
    this.svg.addEventListener('mouseup', this.onDraw.bind(this));
    //     } else {
    //       console.log(ketcherContent)
    //       this.setMol(this.milciclib_core);
    //
    //       ketcherContent[0].innerHTML = "<style>menu { display: none; }; }</style>"
    //
    //
    // // remove event handlers
    //       var clone = iframeContent[0].cloneNode();
    //       // // while (ketcherContent[0].firstChild) {
    //       // //   clone.appendChild(ketcherContent[0].lastChild);
    //       // // }
    //       ketcherContent[0].parentNode.replaceChild(clone, ketcherContent[0]);
    //
    //     }
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
    this.structSvc.announceSmiles(this.structQuery);
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
    var ketcher = this.getKetcher();

    if (ketcher) {
      // check if a "full" molfile; if not, delete the structure.
      if (inputMol.length > 70) {
        ketcher.setMolecule(inputMol)
      } else {
        // var element = document.getElementById('');
        this.clearStruct();
        // text[0].parentNode.removeChild(text[0]);
        // path.parentNode.removeChild(path);
      };
      // ketcher.setZoom(3);
    }
  }

  clearStruct() {
    let text = this.svg.querySelectorAll("text");
    let path = this.svg.querySelectorAll("path");
    for (let i = 0; i < text.length; i++) {
      text[i].parentNode.removeChild(text[i]);
    }

    for (let j = 0; j < path.length; j++) {
      path[j].parentNode.removeChild(path[j]);
    }
  }

}
