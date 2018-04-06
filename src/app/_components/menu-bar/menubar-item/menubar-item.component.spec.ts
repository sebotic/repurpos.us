import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenubarItemComponent } from './menubar-item.component';

describe('MenubarItemComponent', () => {
  let component: MenubarItemComponent;
  let fixture: ComponentFixture<MenubarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenubarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenubarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
