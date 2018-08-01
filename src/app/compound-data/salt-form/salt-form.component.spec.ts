import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaltFormComponent } from './salt-form.component';

describe('SaltFormComponent', () => {
  let component: SaltFormComponent;
  let fixture: ComponentFixture<SaltFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaltFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaltFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
