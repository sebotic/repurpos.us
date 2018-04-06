import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NglComponent } from './ngl.component';

describe('NglComponent', () => {
  let component: NglComponent;
  let fixture: ComponentFixture<NglComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NglComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NglComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
