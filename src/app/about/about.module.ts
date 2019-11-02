import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ---
import { CitationModule } from '../citation/citation.module';
import { TermsModule } from '../terms/terms.module';

// --- components ---
import { AboutComponent } from './about.component';


import { AboutRoutingModule } from './about-routing.module';
import { SourcesComponent } from './sources/sources.component';
import { AccessLibraryComponent } from './access-library/access-library.component';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,
    CitationModule,
    TermsModule
  ],
  declarations: [
    AboutComponent,
    SourcesComponent,
    AccessLibraryComponent,
  ]
})
export class AboutModule { }
