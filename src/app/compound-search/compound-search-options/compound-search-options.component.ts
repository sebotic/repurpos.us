import { Component, OnInit } from '@angular/core';
import {NgForm, NgModel} from '@angular/forms';


export interface Theme {
  display: string;
  backgroundColor: string;
  fontColor: string;
}

export interface User {
  name: string; // text
  limit?: number; // number
  searchMode?: string; // radio
  role?: string; // select (primitive)
  theme?: Theme; // select (object)
  roas?: string[]; // multiple select
  isFDAApproved?: boolean; // checkbox
  toggle?: string; // checkbox toggle either 'toggled' or 'untoggled'
  atc?: string;
}

@Component({
  selector: 'app-compound-search-options',
  templateUrl: './compound-search-options.component.html',
  styleUrls: ['./compound-search-options.component.css']
})
export class CompoundSearchOptionsComponent implements OnInit {

  public atcCodes = [
    { value: 'A', display: 'A ' + 'ALIMENTARY TRACT AND METABOLISM'.toLocaleLowerCase() },
    { value: 'B', display: 'B ' + 'BLOOD AND BLOOD FORMING ORGANS'.toLocaleLowerCase() },
    { value: 'C', display: 'C ' + 'CARDIOVASCULAR SYSTEM'.toLocaleLowerCase() },
    { value: 'D', display: 'D ' + 'DERMATOLOGICALS'.toLocaleLowerCase() },
    { value: 'G', display: 'G ' + 'GENITO URINARY SYSTEM AND SEX HORMONES'.toLocaleLowerCase() },
    { value: 'H', display: 'H ' + 'SYSTEMIC HORMONAL PREPARATIONS, EXCL. SEX HORMONES AND INSULINS'.toLocaleLowerCase() },
    { value: 'J', display: 'J ' + 'ANTIINFECTIVES FOR SYSTEMIC USE'.toLocaleLowerCase() },
    { value: 'L', display: 'L ' + 'ANTINEOPLASTIC AND IMMUNOMODULATING AGENTS'.toLocaleLowerCase() },
    { value: 'M', display: 'M ' + 'MUSCULO-SKELETAL SYSTEM'.toLocaleLowerCase() },
    { value: 'N', display: 'N ' + 'NERVOUS SYSTEM'.toLocaleLowerCase() },
    { value: 'P', display: 'P ' + 'ANTIPARASITIC PRODUCTS, INSECTICIDES AND REPELLENTS'.toLocaleLowerCase() },
    { value: 'R', display: 'R ' + 'RESPIRATORY SYSTEM'.toLocaleLowerCase() },
    { value: 'S', display: 'S ' + 'SENSORY ORGANS'.toLocaleLowerCase() },
    { value: 'V', display: 'V ' + 'VARIOUS'.toLocaleLowerCase() },


  ];

  public searchModes = [
    { value: 'compound', display: 'Compounds' },
    { value: 'class', display: 'Drug classes' },
    { value: 'disease', display: 'Diseases' },
    { value: 'target', display: 'Drug targets' },
  ];
  public roles = [
    { value: 'admin', display: 'Administrator' },
    { value: 'guest', display: 'Guest' },
    { value: 'custom', display: 'Custom' }
  ];
  public themes: Theme[] = [
    { backgroundColor: 'black', fontColor: 'white', display: 'Dark' },
    { backgroundColor: 'white', fontColor: 'black', display: 'Light' },
    { backgroundColor: 'grey', fontColor: 'white', display: 'Sleek' }
  ];

  public roas = [
    { value: 'intravenous', display: 'intravenous' },
    { value: 'topical', display: 'topical' },
    { value: 'oral', display: 'oral' },
    { value: 'inhalation', display: 'inhalation' },
    { value: 'intravitreal', display: 'intravitreal' },
    { value: ' intra-arterial infusion', display: 'intra-arterial infusion'}
  ];

  public toggles = [
    { value: 'toggled', display: 'Toggled' },
    { value: 'untoggled', display: 'UnToggled' },
  ];

  user: User;

  constructor() { }

  ngOnInit() {
    this.user = {
      name: '',
      searchMode: this.searchModes[0].value,
      limit: 100,
      role: null,
      theme: this.themes[0], // default to dark theme
      isFDAApproved: false,
      toggle: this.toggles[1].value, // default to untoggled
      roas: [this.roas[1].value], // default to Technology
      atc: this.atcCodes[0].value,
    }

  }

  onSubmit(f: NgForm) {
    console.log(f.value);  // { first: '', last: '' }
    console.log(f.valid);  // false
  }

  save(isValid: boolean, f: User) {
    if (!isValid) return;
    console.log(f);
    console.log(this.user);
  }

}
