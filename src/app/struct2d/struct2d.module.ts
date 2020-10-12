import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Struct2dComponent } from './struct2d.component';
import { RouterModule } from '@angular/router';

import { DeferLoadModule } from '@trademe/ng-defer-load'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DeferLoadModule,
  ],
  declarations: [ Struct2dComponent ],
  exports: [ Struct2dComponent ]
})

export class Struct2dModule { }
