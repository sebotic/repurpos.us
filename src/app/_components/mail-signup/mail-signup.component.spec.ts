import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSignupComponent } from './mail-signup.component';

describe('MailSignupComponent', () => {
  let component: MailSignupComponent;
  let fixture: ComponentFixture<MailSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
