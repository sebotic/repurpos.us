import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsComponent } from '../_dialogs/terms/terms.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ TermsComponent ],
  exports: [ TermsComponent ],
  entryComponents: [
    TermsComponent]
})

export class TermsModule { }
