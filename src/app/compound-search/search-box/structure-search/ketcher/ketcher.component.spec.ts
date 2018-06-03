import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KetcherComponent } from './ketcher.component';

describe('KetcherComponent', () => {
  let component: KetcherComponent;
  let fixture: ComponentFixture<KetcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KetcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KetcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
