import { Component, OnInit, Input } from '@angular/core';

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { StructureSvgService } from '../_services/index';

@Component({
  selector: 'app-struct2d',
  templateUrl: './struct2d.component.html',
  styleUrls: ['./struct2d.component.css']
})
export class Struct2dComponent implements OnInit {
  @Input() structure: string;
  @Input() struct_type: string;
  svg: SafeHtml;

  constructor(private domSanitizer: DomSanitizer, private svgSvc: StructureSvgService) { }

  ngOnInit() {
    this.svgSvc.getSVG(this.structure, this.struct_type)
      .subscribe(
        (results: string) => {
          // console.log(results)

          this.svg = this.domSanitizer.bypassSecurityTrustHtml(results)
        },
        (err: any) => {
          // console.log('error in SMILES')
          // console.log(err)
        }
      );


  }

}
