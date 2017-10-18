import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicationsGraphComponent } from './indications-graph.component';

describe('IndicationsGraphComponent', () => {
  let component: IndicationsGraphComponent;
  let fixture: ComponentFixture<IndicationsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicationsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicationsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
