import { Component, OnInit } from '@angular/core';

// import 'ketcher';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.css']
})

export class StructureSearchComponent implements OnInit {
  // test: Taxol
  structureQuery: string = 'CC1=C2C(C(=O)C3(C(CC4C(C3C(C(C2(C)C)(CC1OC(=O)C(C(C5=CC=CC=C5)NC(=O)C6=CC=CC=C6)O)O)OC(=O)C7=CC=CC=C7)(CO4)OC(=O)C)O)C)OC(=O)C';

  constructor() { }

  ngOnInit() {
  }

}
