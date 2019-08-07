import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssayDataComponent } from './assay-data.component';

const routes: Routes = [{
  path: '',
  component: AssayDataComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AssayDataRoutingModule { }
