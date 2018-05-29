import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureSearchOptionsComponent } from './structure-search-options.component';

describe('StructureSearchOptionsComponent', () => {
  let component: StructureSearchOptionsComponent;
  let fixture: ComponentFixture<StructureSearchOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureSearchOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureSearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
