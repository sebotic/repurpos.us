import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayTypeBtnComponent } from './assay-type-btn.component';

describe('AssayTypeBtnComponent', () => {
  let component: AssayTypeBtnComponent;
  let fixture: ComponentFixture<AssayTypeBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayTypeBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayTypeBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
