import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Struct2dComponent } from './struct2d.component';

describe('Struct2dComponent', () => {
  let component: Struct2dComponent;
  let fixture: ComponentFixture<Struct2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Struct2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Struct2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
