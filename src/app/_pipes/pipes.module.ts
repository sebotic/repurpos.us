import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SciItalicizePipe } from '.';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ SciItalicizePipe ],
  exports: [ SciItalicizePipe]
})

export class PipesModule { }
