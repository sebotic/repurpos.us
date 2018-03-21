import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from './compound-data/compound-data.component';
import { AboutComponent } from './about/about.component';
import { AssaysComponent } from './assays/assays.component';
import { AssayDataComponent } from './assay-data/assay-data.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

const appRoutes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'assays', component: AssaysComponent, pathMatch: 'full' },
  { path: 'assays/:aid', component: AssayDataComponent, pathMatch: 'full' },
  { path: 'compound_data/:qid', component: CompoundDataComponent, pathMatch: 'full' },
  { path: 'confirm/:cid', component: ConfirmEmailComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [CompoundSearchComponent, AboutComponent, AssaysComponent, AssayDataComponent, CompoundDataComponent, ConfirmEmailComponent];
