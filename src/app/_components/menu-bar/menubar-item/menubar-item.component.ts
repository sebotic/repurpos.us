import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { RouteDef } from '../../../_models/index';

@Component({
  selector: 'menubar-item',
  templateUrl: './menubar-item.component.html',
  styleUrls: ['./menubar-item.component.scss']
})
export class MenubarItemComponent {
  @Input('item') item: RouteDef;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location) {
  }

  isActive(): boolean {
    return `/${this.item.path}` === this.location.path();
  }
}
