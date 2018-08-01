import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalPhaseComponent } from './clinical-phase.component';

describe('ClinicalPhaseComponent', () => {
  let component: ClinicalPhaseComponent;
  let fixture: ComponentFixture<ClinicalPhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicalPhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
