import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundHeaderComponent } from './compound-header.component';

describe('CompoundHeaderComponent', () => {
  let component: CompoundHeaderComponent;
  let fixture: ComponentFixture<CompoundHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
