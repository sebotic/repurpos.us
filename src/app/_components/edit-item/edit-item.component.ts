// import { Overlay, overlayConfigFactory } from 'ngx-modialog';
// import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';

import { Component } from '@angular/core';

/**
 * @title Dialog Overview
 */

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  // template: '<dialog-overview-example></dialog-overview-example>',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
  showDialog:boolean = false ;

  constructor() {  }

  dialog(){
    if (this.showDialog) {
      this.showDialog = false;
    }
    else {
      this.showDialog = true;
    }

  }

}
