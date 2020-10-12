import {Component, OnInit, Input, OnChanges, HostListener} from '@angular/core';

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { StructureSvgService } from '../_services/index';
import { DeferLoadModule } from '@trademe/ng-defer-load'

@Component({
  selector: 'app-struct2d',
  templateUrl: './struct2d.component.html',
  styleUrls: ['./struct2d.component.scss']
})
export class Struct2dComponent implements OnInit {
  @Input() smiles: string;
  @Input() structure: string;
  @Input() struct_type: string;
  @Input() launch_search: boolean = true;
  svg: SafeHtml;

  constructor(private domSanitizer: DomSanitizer, private svgSvc: StructureSvgService) { }

  ngOnInit() {


  }

  ngOnChanges() {
    if (this.struct_type !== 'svg') {
      this.svgSvc.getSVG(this.structure, this.struct_type)
        .subscribe(
          (results: string) => {
            this.svg = this.domSanitizer.bypassSecurityTrustHtml(results);
          },
          (err: any) => {
            // console.log('error in SMILES')
            // console.log(err)
          }
        );
    }
    else {
      this.svg = this.domSanitizer.bypassSecurityTrustHtml(this.structure);
    }
  }

  // @HostListener("window:scroll", [])
  // onScroll(): void {
  //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  //     if (this.struct_type !== 'svg') {
  //       this.svgSvc.getSVG(this.structure, this.struct_type)
  //         .subscribe(
  //           (results: string) => {
  //             this.svg = this.domSanitizer.bypassSecurityTrustHtml(results);
  //           },
  //           (err: any) => {
  //             // console.log('error in SMILES')
  //             // console.log(err)
  //           }
  //         );
  //     }
  //     else {
  //       this.svg = this.domSanitizer.bypassSecurityTrustHtml(this.structure);
  //     }
  //   }
  // }
  showMyElement: boolean;

}
