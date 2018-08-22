import { Component, OnInit, Input } from '@angular/core';

import { VendorData} from '../../_models/index';
import { CompoundService } from '../../_services/index';

@Component({
  selector: 'app-compound-vendor-data',
  templateUrl: './compound-vendor-data.component.html',
  styleUrls: ['./compound-vendor-data.component.scss']
})

export class CompoundVendorDataComponent implements OnInit {
  private vendors: Array<Object> = [
    { 'name': 'GVK Excelra GoStar', 'link': 'https://gostardb.com/gostar/loginEntry.do', 'id': 'gvk'},
    { 'name': 'Clarivate Integrity', 'link': 'https://integrity.thomson-pharma.com/integrity/xmlxsl/pk_home.util_home', 'id': 'integrity'},
    { 'name': 'Citeline Pharmaprojects', 'link': 'https://pharmaintelligence.informa.com/contact/contact-us', 'id': 'informa'}
  ];

  public vendor_data: VendorData;

  constructor(private cmpdSvc: CompoundService) {
    this.cmpdSvc.vendorState.subscribe((vdata: VendorData) => {
      this.vendor_data = vdata;
    })
  }

  ngOnInit() {
  }

}
