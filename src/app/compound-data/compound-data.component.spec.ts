import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundDataComponent } from './compound-data.component';

describe('CompoundDataComponent', () => {
  let component: CompoundDataComponent;
  let fixture: ComponentFixture<CompoundDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
