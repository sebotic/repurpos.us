import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-compound-vendor-data',
  templateUrl: './compound-vendor-data.component.html',
  styleUrls: ['./compound-vendor-data.component.css']
})

export class CompoundVendorDataComponent implements OnInit {
  @Input() vendors: Array<Object>;
  @Input() gvkData: Object = [];
  @Input() informaData: Object = [];
  @Input() integrityData: Object = [];
  @Input() loggedIn: boolean;

  constructor() { }

  ngOnInit() {
  }

}
