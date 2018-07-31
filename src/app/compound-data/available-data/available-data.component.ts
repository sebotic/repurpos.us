import { Component, OnInit, Input } from '@angular/core';
import { LoginStateService } from '../../_services/login-state.service';

@Component({
  selector: 'app-available-data',
  templateUrl: './available-data.component.html',
  styleUrls: ['./available-data.component.scss']
})

export class AvailableDataComponent implements OnInit {
  @Input() availData: Object[];
  private loggedIn: boolean;

  constructor(private loginStateService: LoginStateService) {

    loginStateService.isUserLoggedIn.subscribe(logState => {
      this.loggedIn = logState.loggedIn
    })
  }

  ngOnInit() {
  }

}
