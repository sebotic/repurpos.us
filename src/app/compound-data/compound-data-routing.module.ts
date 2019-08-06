import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompoundDataComponent } from './compound-data.component';

const routes: Routes = [
  { path: '', component: CompoundDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CompoundDataRoutingModule { }
