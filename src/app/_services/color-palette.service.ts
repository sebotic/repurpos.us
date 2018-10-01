import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

import { AssayDetails } from '../_models/index';

import * as d3 from 'd3';
import * as chroma from 'chroma-js';

@Injectable()
export class ColorPaletteService {

  public uniqueColors: Object = {
    "aquamarine": "#00b8a0",
    "orange-red": "#ff602c",
    "jade": "#00a650",
    "purple": "#9d02d7",
    "brand-blue": "#3d6de0",
    "yellow": "#ffc01c",
    "brown": "#804a1e",
    "pink": "#ce496c",
    "lt-green": "#80bc5e",
    "purple-blue": "#6d38dc",
    "lt-brown": "#9e7e70",
    "teal": "#1f93c0",
    "orange": "#ff8f00",
    "magenta": "#ce018a",
    "green": "#009400",
    "khaki": "#9e977e",
    "med-blue": "#4f5dbc",
    "lt-pink": "#ce617a",
    "yellow-green": "#80aa0e",
    "mauve": "#805c6e",
    "emerald": "#1f8170",
    "violet": "#9e378e",
    "navy": "#4f4b6c",
    "avocado": "#809200",
    "brand-red": "#ff003c",
    "default": "#9ba4ae"
  };

  public colorList: string[];
  public indicationList: string[];


  public assaysSubject: BehaviorSubject<AssayDetails[]> = new BehaviorSubject<AssayDetails[]>([]);
  public assaysState = this.assaysSubject.asObservable();

  constructor(private http2: HttpClient) {
    this.colorList = Object.keys(this.uniqueColors).map(key => this.uniqueColors[key]);

    this.retrieveAssayList();

  }

  // Get the full list of assay indications, to map to a consistent set of values
  retrieveAssayList(): void {
    this.http2.get(environment.host_url + '/assay_list', {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
    }).subscribe((r: any) => {
      let b = r.body;

      this.assaysSubject.next(b);


      this.indicationList = b.map((d: any) => d.indication);
    });
  }

  getColorPalette = function(color: string, num_vals: number) {

    let vals: number[] = d3.range(0.25, 2.75, (2.5 / Math.floor(num_vals/2)));
    let arr = [];

    for (let i = vals.length - 1; i >= 0; i--) {
      arr.push(chroma(color).darken(vals[i]).hex());
    }

    if (num_vals % 2) {
      arr.push(color);
    }

    for (let j = 0; j < vals.length; j++) {
      arr.push(chroma(color).brighten(vals[j]).hex());
    }

    // console.log(arr)
    return (arr)
  }



  getIndicColor(indication: string, lt_pct: number = 0.75) {
    // this.getColorPalette('ff602c', 3)
    if (this.indicationList) {
      let indicColors = this.colorList;

      // hijack d3's color scale mapping
      let indicColorScale = d3.scaleOrdinal().domain(this.indicationList).range(indicColors);

      let bg = indicColorScale(indication);
      let bg2 = chroma(bg).luminance(0.5);


      // Note: recommendation is for a more stringent contrast cutoff at 4.5.
      let font_color1 = chroma.contrast(bg, 'white') < 3 ? '#212529' : 'white';
      let font_color2 = chroma.contrast(bg2, 'white') < 3 ? '#212529' : 'white';

      return ({ 'bg1': bg, 'background': bg2, 'bg-lt': chroma(bg).luminance(lt_pct), 'font': font_color2, 'font1': font_color1 })
    }
    else {
      return ({ 'background': 'none', 'bg-lt': 'none', 'font': 'none' })
    }
  }



}
