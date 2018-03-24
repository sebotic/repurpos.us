import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassButtonComponent } from './forgot-pass-button.component';

describe('ForgotPassButtonComponent', () => {
  let component: ForgotPassButtonComponent;
  let fixture: ComponentFixture<ForgotPassButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPassButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPassButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
