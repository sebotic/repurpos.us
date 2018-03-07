import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssayPaginationComponent } from './assay-pagination.component';

describe('AssayPaginationComponent', () => {
  let component: AssayPaginationComponent;
  let fixture: ComponentFixture<AssayPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssayPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssayPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
