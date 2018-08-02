import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-salt-form',
  templateUrl: './salt-form.component.html',
  styleUrls: ['./salt-form.component.scss']
})
export class SaltFormComponent implements OnInit {

  uniqueColors: Object = {
    "brown": "#804a1e",
    "lt-brown": "#9e7e70",
    "khaki": "#9e977e",
    "mauve": "#805c6e",
    "lt-pink": "#ce617a",
    "pink": "#ce496c",
    "magenta": "#ce018a",
    "violet": "#9e378e",
    "purple": "#9d02d7",
    "purple-blue": "#6d38dc",
    "navy": "#4f4b6c",
    "med-blue": "#4f5dbc",
    "brand-blue": "#3d6de0",
    "teal": "#1f93c0",
    "aquamarine": "#00b8a0",
    "emerald": "#1f8170",
    "jade": "#00a650",
    "green": "#009400",
    "lt-green": "#80bc5e",
    "yellow-green": "#80aa0e",
    "avocado": "#809200",
    "yellow": "#ffc01c",
    "orange": "#ff8f00",
    "orange-red": "#ff602c",
    "brand-red": "#ff003c"
  };

  salt_colors: Object = {
    'hydrochloride': this.uniqueColors['jade'],
    'sodium': this.uniqueColors['orange'],
    'Formic Acid': this.uniqueColors['yellow'],
    'hydrate': this.uniqueColors['brand-blue'],
    'hydrobromide': this.uniqueColors['purple'],
    'manually curated': this.uniqueColors['brand-red']
  }

  salts: string[] = [Object.keys(this.salt_colors)[Math.floor(Math.random() * 5)]];

  constructor() { }


  ngOnInit() {
  }

}
