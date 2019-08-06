import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayDwnldComponent } from './assay-dwnld.component';

describe('AssayDwnldComponent', () => {
  let component: AssayDwnldComponent;
  let fixture: ComponentFixture<AssayDwnldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayDwnldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayDwnldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
