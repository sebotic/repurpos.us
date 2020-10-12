import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundPrimaryScreeningDataComponent } from './compound-primary-screening-data.component';

describe('PrimaryScreeningDataComponent', () => {
  let component: CompoundPrimaryScreeningDataComponent;
  let fixture: ComponentFixture<CompoundPrimaryScreeningDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundPrimaryScreeningDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundPrimaryScreeningDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
