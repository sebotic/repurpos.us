import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCompoundsComponent } from './similar-compounds.component';

describe('SimilarCompoundsComponent', () => {
  let component: SimilarCompoundsComponent;
  let fixture: ComponentFixture<SimilarCompoundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarCompoundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarCompoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
