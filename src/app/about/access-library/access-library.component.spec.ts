import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLibraryComponent } from './access-library.component';

describe('AccessLibraryComponent', () => {
  let component: AccessLibraryComponent;
  let fixture: ComponentFixture<AccessLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
