import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundAssayDataComponent } from './compound-assay-data.component';

describe('CompoundAssayDataComponent', () => {
  let component: CompoundAssayDataComponent;
  let fixture: ComponentFixture<CompoundAssayDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundAssayDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundAssayDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
