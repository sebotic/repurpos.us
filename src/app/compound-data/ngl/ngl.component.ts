import { Component, Injectable, OnInit, Input, OnChanges, AfterViewInit } from '@angular/core';
import { Stage, Selection } from 'ngl';
import { Subject } from "rxjs/Subject";
import { isNullOrUndefined } from "util";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import { CIDService } from '../../_services/index';

@Component({
  selector: 'app-ngl',
  templateUrl: './ngl.component.html',
  styleUrls: ['./ngl.component.css']
})
export class NglComponent implements OnInit {
  labelRepr;
  ballStickRepr;
  structureComp;
  hasHydrogens = true;
  hasLabels = false;
  modelSele = "/0";
  stage;
  cid;
  @Input() input: string;

  constructor(private cidService: CIDService, private http: HttpClient) {
    // this.cidService.newCID$.subscribe(
    //   cid => {
    //     if (isNullOrUndefined(this.cid)) {
    //       // this.cid = cid;
    //       // console.log('new cid', this.cid);
    //       // this.renderMolecule();
    //     }
    //
    //   });
    // this.cidService.newCID$.subscribe(
    //   cid => {
    //     if (isNullOrUndefined(this.cid)) {
    //       // this.cid = cid;
    //       // console.log('new cid', this.cid);
    //       // this.renderMolecule();
    //     }
    //
    //   });
  }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.renderMolecule();
  }

  ngOnChanges() {
    if (this.input) {
      this.cid = this.input;
      this.renderMolecule();
    }
  }

  makeMolecule(blob: Blob, fileType: string) {
    let curr = this;

    this.stage.loadFile(blob, { ext: fileType, defaultRepresentation: false }).then(function(comp) {
      curr.modelSele = curr.hasNaNCoords(comp.structure, "/0") ? "/1" : "/0";
      curr.structureComp = comp;
      curr.structureComp.setSelection(curr.getSelection());
      curr.ballStickRepr = comp.addRepresentation("ball+stick", { multipleBond: "symmetric" });
      // this.labelRepr = comp.addRepresentation( "label", {
      //    labelType: "atomname", color: "black",
      //    fontWeight: "normal", xOffset: 0.1, yOffset: 0.1, radius: 1.4
      // } );
      // curr.toggleLabels();
      // curr.toggleHydrogens();

      curr.hasHydrogens = false;
      // curr.stage.centerView();

      // set to be max zoom
      curr.stage.autoView();


    });
  }

  renderMolecule() {

    if (document.getElementById(this.cid)) {
      this.stage = new Stage(this.cid, {
        backgroundColor: "white",
        clipDist: 0,
        sampleLevel: 2,
        rotateSpeed: 0,
        zoomSpeed: 0 // turns off zoomability
      });

      // tooltips should be changed to: atom.toObject().element -- but can't figure out how to turn off the default tooltip

      // a way to get the structure data from chemspider.com (example Vemurafenib), filetype is mol, not sdf
      // 'http://chemspider.com/FilesHandler.ashx?type=str&striph=yes&id=24747352'

      let url = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + this.cid +
        '/record/SDF/?record_type=2d&response_type=save&response_basename=Structure2D_CID_' + this.cid;

      this.http.get(url, { observe: 'response', responseType: 'text', }).subscribe((re) => {
        this.makeMolecule(new Blob([re.body]), 'sdf');
      },
        (err: HttpErrorResponse) => {
          // if 3D structure, for historic reasons
          // let u = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' + this.cid +
          //   '/record/SDF/?record_type=3d&response_type=save&response_basename=Structure3D_CID_' + this.cid;
          //
          // this.http.get(u, { observe: 'response', responseType: 'text' }).subscribe((r) => {
          //   this.makeMolecule(new Blob([r.body]), 'sdf');
          // });
        },
      );


      // this.stage.autoView();
      // this.stage.loadFile('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/124886/record/SDF/?record_type=3d&response_type=save&response_basename=Structure3D_CID_124886', { ext: 'sdf', defaultRepresentation: true }).then( function( comp ){
    }
  }

  getSelection() {
    return this.hasHydrogens ? "not _h and " + this.modelSele : this.modelSele;
  }

  hasNaNCoords(structure, sele) {
    let foundNaN = false;
    structure.getView(new Selection(sele)).eachAtom(function(a) {
      if (isNaN(a.x) || isNaN(a.y) || isNaN(a.z)) {
        foundNaN = true;
      }
    });
    return foundNaN;
  }

}
