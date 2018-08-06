import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-clinical-phase',
  templateUrl: './clinical-phase.component.html',
  styleUrls: ['./clinical-phase.component.scss']
})
export class ClinicalPhaseComponent implements OnInit {
  @Input() phase: string;
  @Input() vendorName: string;
  phases: Object = {
    'gvk': [
      {
        'name': 'Suspended',
        'order': -1,
        'failed': true
      },
      {
        'name': 'WITHDRAWN DRUG',
        'order': -1,
        'failed': true
      },
      {
        'name': 'Discontinued',
        'order': -1,
        'failed': true
      },
      {
        'name': 'No Development',
        'order': -1,
        'failed': true
      },
      {
        'name': 'Preclinical',
        'order': 0
      },
      {
        'name': 'Phase I',
        'label': 'I',
        'order': 1
      },
      {
        'name': 'Phase II',
        'label': 'II',
        'order': 2
      },
      {
        'name': 'Phase III',
        'label': 'III',
        'order': 3
      },
      {
        'name': 'Pre-registration',
        'order': 4
      },
      {
        'name': 'PRESCRIPTION DRUG',
        'order': 5,
        'approved': true
      },
      {
        'name': 'Clinical',
        'order': 5,
        'approved': true,
        'synonym': true
      },
      {
        'name': 'DRUG',
        'order': 5,
        'approved': true,
        'synonym': true
      },
      {
        'name': 'OVER THE COUNTER DRUG',
        'order': 5,
        'approved': true,
        'synonym': true
      },
      {
        'name': 'Clinical Phase Unknown',
        'order': null
      }],
    'integrity':
      [
        {
          'name': 'Preclinical',
          'order': 0
        },
        {
          'name': 'IND Filed',
          'order': 1
        }, {
          'name': 'Phase 0',
          'order': 2,
          'label': '0'
        }, {
          'name': 'Phase I',
          'order': 3,
          'label': 'I'
        }, {
          'name': 'Phase I/II',
          'order': 3.5
        }, {
          'name': 'Phase II',
          'order': 4,
          'label': 'II'
        },
        {
          'name': 'Phase II/III',
          'order': 4.5
        }, {
          'name': 'Phase III',
          'order': 5,
          'label': 'III'
        }, {
          'name': 'Pre-Registered',
          'order': 6,
          'label': ''
        }, {
          'name': 'Recommended Approval',
          'order': 7
        },
        {
          'name': 'Registered',
          'order': 8
        },
        {
          'name': 'Launched',
          'order': 9,
          'approved': true
        }, {
          'name': 'Clinical',
          'order': 9,
          'approved': true,
          'synonym': true
        }, {
          'name': 'Discontinued',
          'order': -1,
          'failed': true
        }, {
          'name': 'Suspended',
          'order': -1,
          'failed': true
        }, {
          'name': 'Withdrawn',
          'order': -1,
          'failed': true
        }
      ],
    'informa': [
      {
        'name': 'Discontinued',
        'order': -1,
        'failed': true
      },
      {
        'name': 'No Development Reported',
        'order': -1,
        'failed': true
      },
      {
        'name': 'Suspended',
        'order': -1,
        'failed': true
      },
      {
        'name': 'Withdrawn',
        'order': -1,
        'failed': true
      },
      {
        'name': 'Preclinical',
        'order': 0
      },
      {
        'name': 'Phase I Clinical Trial',
        'order': 1,
        label: "I",
      },
      {
        'name': 'Phase I',
        'order': 1,
        label: "I",
        synonym: true
      },
      {
        'name': 'Phase II Clinical Trial',
        'order': 2,
        label: "II"
      },
      {
        'name': 'Phase II',
        'order': 2,
        label: "II",
        synonym: true
      },
      {
        'name': 'Phase II/III Clinical Trial',
        'order': 2.5
      },
      {
        'name': 'Phase III Clinical Trial',
        'order': 3,
        label: "III"
      },
      {
        'name': 'Phase III',
        'order': 3,
        synonym: true
      },
      {
        'name': 'Pre-registered',
        'order': 4
      },
      {
        'name': 'Pre-registration',
        'order': 4,
        synonym: true
      },
      {
        'name': 'Registered',
        'order': 5
      },
      {
        'name': 'Launched',
        'order': 6,
        approved: true
      }
    ]
  }

  // phase_order: number[];
  sel_phases: Object[];

  current_phase: number;

  circle_radius: number = 10;

  constructor() { }

  ngOnInit() {
    console.log(this.vendorName)
    console.log(this.phase)
    console.log(this.phases)
    if (this.phases.hasOwnProperty(this.vendorName)) {
      // filter out any half-steps in process
      this.sel_phases = this.phases[this.vendorName].filter(d => (d.order || d.order === 0) && !((d.order * 2) % 2) && d.order > -1 && d.synonym != true);

      this.findPhase();
    }

  }

  findPhase() {
    let tmp = this.phases[this.vendorName].filter((d: any) => this.phase.includes(d.name))
    console.log(tmp)
    if (tmp.length > 0) {
      this.current_phase = Math.max(<number>tmp.map((d: any) => d.order));
      console.log(this.current_phase)
    } else {
      this.current_phase = null;
    }
  }

  findClass(i: number) {
    if (this.current_phase < 0) {
      return ('failed')
    }
    else if (i === this.current_phase) {
      return ('current')
    } else if ((Math.round(this.current_phase) === i) || (Math.floor(this.current_phase) === i)) {
      return ('in-between current')
    } else if (i > this.current_phase) {
      return ('high')
    } else {
      return ('low')
    }
  }

}
