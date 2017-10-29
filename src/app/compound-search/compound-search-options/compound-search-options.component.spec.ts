import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundSearchOptionsComponent } from './compound-search-options.component';

describe('CompoundSearchOptionsComponent', () => {
  let component: CompoundSearchOptionsComponent;
  let fixture: ComponentFixture<CompoundSearchOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundSearchOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundSearchOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
