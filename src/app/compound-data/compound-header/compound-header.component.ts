import { Component, OnInit, Input } from '@angular/core';

import { SimilarityData } from '../../_models';

@Component({
  selector: 'app-compound-header',
  templateUrl: './compound-header.component.html',
  styleUrls: ['./compound-header.component.css']
})

export class CompoundHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() aliases: Array<string> = [];
  @Input() idData: Array<Object> = [];
  @Input() chemVendors: Array<Object> = [];
  @Input() integrityData: Object = [];
  @Input() similarityData: Array<SimilarityData>;


  constructor() { }

  ngOnInit() {
  }

}
