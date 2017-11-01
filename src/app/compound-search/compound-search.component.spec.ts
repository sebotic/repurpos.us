import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundSearchComponent } from './compound-search.component';

describe('CompoundSearchComponent', () => {
  let component: CompoundSearchComponent;
  let fixture: ComponentFixture<CompoundSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
