import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.css']
})

export class StructureSearchComponent implements OnInit {
  structureQuery: string;

  constructor() { }

  ngOnInit() {
  }

  sendStructure(struct_smiles: string) {
    console.log('heard')
    this.structureQuery = struct_smiles;
    console.log(this.structureQuery)
  }

}
