import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpdTooltipComponent } from './cmpd-tooltip.component';

describe('CmpdTooltipComponent', () => {
  let component: CmpdTooltipComponent;
  let fixture: ComponentFixture<CmpdTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmpdTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpdTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
