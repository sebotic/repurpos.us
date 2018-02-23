import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayPlotsComponent } from './assay-plots.component';

describe('AssayPlotsComponent', () => {
  let component: AssayPlotsComponent;
  let fixture: ComponentFixture<AssayPlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayPlotsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayPlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
