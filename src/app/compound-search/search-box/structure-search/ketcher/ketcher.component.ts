import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { StructureService } from '../../../../_services/index';

@Component({
  selector: 'app-ketcher',
  templateUrl: './ketcher.component.html',
  styleUrls: ['./ketcher.component.css']
})

export class KetcherComponent implements OnInit {
  structQuery: string;
  iframe: any;

  @Output() structEmitter = new EventEmitter<string>();

  testMol: string =
    [
      "",
      "  Ketcher 02151213522D 1   1.00000     0.00000     0",
      "",
      "  6  6  0     0  0            999 V2000",
      "   -1.1750    1.7500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.3090    1.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.3090    0.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -1.1750   -0.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -2.0410    0.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -2.0410    1.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "  1  2  1  0     0  0",
      "  2  3  2  0     0  0",
      "  3  4  1  0     0  0",
      "  4  5  2  0     0  0",
      "  5  6  1  0     0  0",
      "  6  1  2  0     0  0",
      "M  END"
    ].join("\n");



  // WORKS: HCl
  testMol2 = "\n" +
    "Ketcher  5311813352D 1   1.00000     0.00000     0\n" +
    "\n" +
    " 1  0  0     0  0            999 V2000\n" +
    "    9.9250   -4.3000    0.0000 P   0  0  0  0  0  0  0  0  0  0  0  0\n" +
    "M  CHG  1   1  -1\n" +
    "M  END";



  acetaminophen: string =
    // from ChEBI
    [
      "",
      "Mrv0541 10231312482D  1   1.00000     0.00000     0 ",
      "",
      " 11 11  0  0  0  0            999 V2000",
      "    0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000   -0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    1.4288    1.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145    2.0624    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145    2.8874    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000    1.6500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000   -1.6499    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
      "  2  1  1  0  0  0  0",
      "  1  3  2  0  0  0  0",
      " 10  3  1  0  0  0  0",
      "  4  2  2  0  0  0  0",
      "  4 11  1  0  0  0  0",
      "  4  5  1  0  0  0  0",
      "  6  5  2  0  0  0  0",
      "  3  6  1  0  0  0  0",
      "  7  8  1  0  0  0  0",
      "  8  9  2  0  0  0  0",
      "  8 10  1  0  0  0  0",
      "M  END"
    ].join("\n");

  submitSubscription: Subscription;


  constructor(private domSanitizer: DomSanitizer, private structSvc: StructureService) {
    // Service to insert the ketcher structure drawing module into an iframe
    // domSanitizer required to make sure the browser doesn't freak out about having html injected
    this.iframe = this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/ketcherv2/ketcher.html');
    // this.iframe = this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/ketcher/ketcher.html?ketcher_maximize');


    // service to check if the submit button has been pressed.
    this.submitSubscription = structSvc.submitPressed$.subscribe(pressedStatus => {

      if (pressedStatus) {
        this.getSmiles();
      }
    })

  }

  ngOnInit() {
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
      // console.log(this.structQuery)
      // this.structEmitter.emit(this.structQuery);

      this.structSvc.announceStructure(this.structQuery);
    }
  }

  setMol(inputMol: string) {
    // console.log(inputMol)
    var ketcher = this.getKetcher();
    ketcher.setMolecule(inputMol);
  }

}
