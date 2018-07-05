import { Injectable } from '@angular/core';

import * as Chroma from 'chroma-js';

@Injectable()
export class TanimotoScaleService {

  // public colorDomain: Array<string> = ['#ffffff', '#ffb6b0', '#f36664', '#c3152e'];
  // brighter, more saturated red
  public colorDomain: Array<string> = ['#ffffff', '#ffb6b0', '#f36664', '#FF5B67', '#DA0033'];

  constructor() { }

  getScale() {
    let domain = this.colorDomain;

    let func = function(value: number, alpha: number = 1, colorDomain: string[] = domain, colorRange: number[] = [0.5, 1]) {
      let scale = Chroma.scale(colorDomain).domain(colorRange).mode('lab');

      return (scale(value).alpha(alpha).css());
    }

    return (func);
  }

  getFontColor() {
    let domain = this.colorDomain;

    let func = function(value: number, black_color: string = '#212529', colorDomain: string[] = domain) {
      let scale = Chroma.scale(colorDomain).mode('lab');
      let background_color = scale(value);

      if (Chroma.contrast(background_color, black_color) > 4.5) {
        return black_color;
      }
      return '#ffffff';
    }

    return (func);

  }
}
