import {
  Component,
  Input
} from '@angular/core';

import { RouteDef } from '../../_models/index';

@Component({
  selector: 'menu-bar',
  templateUrl: 'menu-bar.component.html'
})
export class MenuBarComponent {
  @Input('items') items: RouteDef[];
}
