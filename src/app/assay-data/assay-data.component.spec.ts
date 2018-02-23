import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayDataComponent } from './assay-data.component';

describe('AssayDataComponent', () => {
  let component: AssayDataComponent;
  let fixture: ComponentFixture<AssayDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
