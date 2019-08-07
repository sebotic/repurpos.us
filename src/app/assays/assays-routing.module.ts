import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssaysComponent } from './assays.component';

const routes: Routes = [
  { path: '', component: AssaysComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssaysRoutingModule { }
