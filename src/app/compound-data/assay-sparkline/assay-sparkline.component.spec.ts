import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssaySparklineComponent } from './assay-sparkline.component';

describe('AssaySparklineComponent', () => {
  let component: AssaySparklineComponent;
  let fixture: ComponentFixture<AssaySparklineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssaySparklineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssaySparklineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
