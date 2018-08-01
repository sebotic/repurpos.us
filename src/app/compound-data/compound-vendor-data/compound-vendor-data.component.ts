import { Component, OnInit, Input } from '@angular/core';

import { AssayData, GVKData, IntegrityData, InformaData, VendorData, WDQSData, Compound, SearchResult, LoginState } from '../../_models/index';
import { WDQService, BackendSearchService, LoginStateService } from '../../_services/index';
import { CompoundService } from '../../_services/index';

@Component({
  selector: 'app-compound-vendor-data',
  templateUrl: './compound-vendor-data.component.html',
  styleUrls: ['./compound-vendor-data.component.scss']
})

export class CompoundVendorDataComponent implements OnInit {
  private vendors: Array<Object> = [
    { 'name': 'GVK Excelra GoStar', 'link': 'https://gostardb.com/gostar/loginEntry.do' },
    { 'name': 'Clarivate Integrity', 'link': 'https://integrity.thomson-pharma.com/integrity/xmlxsl/pk_home.util_home' },
    { 'name': 'Citeline Pharmaprojects', 'link': 'https://pharmaintelligence.informa.com/contact/contact-us' }
  ];

  private vendor_data: any;
  // private vendor_data: VendorData;

  constructor(private cmpdSvc: CompoundService) {
    this.cmpdSvc.vendorState.subscribe((vdata: any) => {
    // this.cmpdSvc.vendorState.subscribe((vdata: VendorData) => {
      this.vendor_data = vdata;
    })
  }

  ngOnInit() {
  }

}
