import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationComponent } from './citation.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ CitationComponent ],
  exports: [ CitationComponent ]
})

export class CitationModule { }
