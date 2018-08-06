import { Injectable } from '@angular/core';

@Injectable()
export class ColorPaletteService {

  public uniqueColors: Object = {
    "orange-red": "#ff602c",
    "jade": "#00a650",
    "purple": "#9d02d7",
    "brand-blue": "#3d6de0",
    "yellow": "#ffc01c",
    "brown": "#804a1e",

    "lt-brown": "#9e7e70",
    "khaki": "#9e977e",
    "mauve": "#805c6e",
    "lt-pink": "#ce617a",
    "pink": "#ce496c",
    "magenta": "#ce018a",
    "violet": "#9e378e",

    "purple-blue": "#6d38dc",
    "navy": "#4f4b6c",
    "med-blue": "#4f5dbc",

    "teal": "#1f93c0",
    "emerald": "#1f8170",

    "green": "#009400",
    "lt-green": "#80bc5e",
    "yellow-green": "#80aa0e",


    "orange": "#ff8f00",
    "avocado": "#809200",
    "brand-red": "#ff003c",
    "aquamarine": "#00b8a0",
  };

  public colorList: string[];

  constructor() {
    this.colorList = Object.keys(this.uniqueColors).map(key => this.uniqueColors[key]);

  }

}
