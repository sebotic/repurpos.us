import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailSignupDialogComponent } from './mail-signup-dialog.component';

describe('MailSignupDialogComponent', () => {
  let component: MailSignupDialogComponent;
  let fixture: ComponentFixture<MailSignupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailSignupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailSignupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
