import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundVendorDataComponent } from './compound-vendor-data.component';

describe('CompoundVendorDataComponent', () => {
  let component: CompoundVendorDataComponent;
  let fixture: ComponentFixture<CompoundVendorDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundVendorDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundVendorDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
