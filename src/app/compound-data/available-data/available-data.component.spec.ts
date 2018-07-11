import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableDataComponent } from './available-data.component';

describe('AvailableDataComponent', () => {
  let component: AvailableDataComponent;
  let fixture: ComponentFixture<AvailableDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
