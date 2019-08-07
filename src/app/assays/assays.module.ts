import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssaysRoutingModule } from './assays-routing.module';

// --- common helper modules ---
import { PipesModule } from '../_pipes/pipes.module';
import { MaterialModule } from '../material.module';

// --- pipes ---
import { StandardizeAssayTypePipe } from '../_pipes/standardize-assay-type.pipe';

// --- components ---
import { AssaysComponent } from '../assays/assays.component';
import { BarplotComponent } from './barplot/barplot.component';
import { TreemapComponent } from './treemap/treemap.component';

@NgModule({
  imports: [
    CommonModule,
    AssaysRoutingModule,
    MaterialModule,
    PipesModule
  ],
  declarations: [
    AssaysComponent,
    StandardizeAssayTypePipe,
    BarplotComponent,
    TreemapComponent
  ],
  providers: [
    StandardizeAssayTypePipe
  ]
})

export class AssaysModule { }
