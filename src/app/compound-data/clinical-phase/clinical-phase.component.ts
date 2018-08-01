import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinical-phase',
  templateUrl: './clinical-phase.component.html',
  styleUrls: ['./clinical-phase.component.scss']
})
export class ClinicalPhaseComponent implements OnInit {

  test: string[] = ['', '', 'I', 'II', "III", ''];
  phases: Object = {
    'integrity':
      [
        {
          'name': 'preclinical',
          'order': 0,
          'label': '',
          'failed': false
        },
        {
          'name':
            'IND filed',
          'order': 1,
          'label': '',
          'failed': false
        }, {
          'name': 'phase I',
          'order': 2,
          'label': 'I',
          'failed': false
        }, {
          'name': 'phase I/II',
          'order': 2.5,
          'label': '',
          'failed': false
        }, {
          'name': 'phase II',
          'order': 3,
          'label': 'II',
          'failed': false
        },
        {
          'name': 'phase II/III',
          'order': 3.5,
          'label': '',
          'failed': false
        }, {
          'name': 'phase III',
          'order': 4,
          'label': 'III',
          'failed': false
        }, {
          'name': 'preregistered',
          'order': 5,
          'label': '',
          'failed': false
        }, {
          'name': 'recommended approval',
          'order': 6,
          'label': '',
          'failed': false
        },
        {
          'name': 'registered',
          'order': 7,
          'label': '',
          'failed': false,
          'approved': true
        }]
  }

  sel_phases: Object[];

  current_phase: number;

  circle_radius: number = 10;

  constructor() { }

  ngOnInit() {
    // filter out any half-steps in process
    this.sel_phases = this.phases['integrity'].filter(d => !((d.order*2) % 2))
    let tmp = this.sel_phases.filter((d:any) => d.name == "phase II")
    // console.log(tmp)
    this.current_phase = tmp[0]['order'];

  }

}
