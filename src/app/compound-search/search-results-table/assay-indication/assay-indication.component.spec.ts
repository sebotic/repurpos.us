import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayIndicationComponent } from './assay-indication.component';

describe('AssayIndicationComponent', () => {
  let component: AssayIndicationComponent;
  let fixture: ComponentFixture<AssayIndicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayIndicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayIndicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
