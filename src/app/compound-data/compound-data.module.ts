import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- routing ---
import { CompoundDataRoutingModule } from './compound-data-routing.module';

// --- helper modules ---
import { Struct2dModule } from '../struct2d/struct2d.module';
import { MaterialModule } from '../material.module';
import { PipesModule } from '../_pipes/pipes.module';

// --- components ---
import { CompoundDataComponent } from '../compound-data/compound-data.component';
import { CompoundHeaderComponent } from '../compound-data/compound-header/compound-header.component';
import { SimilarCompoundsComponent } from '../compound-data/similar-compounds/similar-compounds.component';
import { CompoundAssayDataComponent } from '../compound-data/compound-assay-data/compound-assay-data.component';
import { CompoundVendorDataComponent } from '../compound-data/compound-vendor-data/compound-vendor-data.component';
import { CompoundWikidataComponent } from '../compound-data/compound-wikidata/compound-wikidata.component';
import { CompoundWikidataIdsComponent } from '../compound-data/compound-wikidata-ids/compound-wikidata-ids.component';
import { AvailableDataComponent } from '../compound-data/available-data/available-data.component';
import { ClinicalPhaseComponent } from '../compound-data/clinical-phase/clinical-phase.component';
import { SaltFormComponent } from '../compound-data/salt-form/salt-form.component';
import { AssaySparklineComponent } from '../compound-data/assay-sparkline/assay-sparkline.component';
import { SaltWarningDialogComponent } from '../_components/index';
import { SaltWarningComponent } from '../_dialogs/index';
import { CompoundPrimaryScreeningDataComponent } from './compound-primary-screening-data/compound-primary-screening-data.component';

// import { IndicationsGraphComponent } from '../compound-data/indications-graph/indications-graph.component';
// import { ShowMoreButtonComponent, ShowMorePane } from './compound-data/show-more-button/show-more-button.component';


@NgModule({
  imports: [
    CommonModule,
    CompoundDataRoutingModule,
    Struct2dModule,
    MaterialModule,
    PipesModule
  ],
  declarations: [
    CompoundDataComponent,
    CompoundHeaderComponent,
    SimilarCompoundsComponent,
    AvailableDataComponent,
    CompoundAssayDataComponent,
    CompoundVendorDataComponent,
    CompoundWikidataComponent,
    CompoundWikidataIdsComponent,
    ClinicalPhaseComponent,
    SaltFormComponent,
    AssaySparklineComponent,
    SaltWarningComponent,
    SaltWarningDialogComponent,
    CompoundPrimaryScreeningDataComponent,
    // IndicationsGraphComponent
  ],
  entryComponents: [
    SaltWarningComponent
  ]
})

export class CompoundDataModule { }
