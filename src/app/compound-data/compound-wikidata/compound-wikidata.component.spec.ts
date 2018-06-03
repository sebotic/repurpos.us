import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundWikidataComponent } from './compound-wikidata.component';

describe('CompoundWikidataComponent', () => {
  let component: CompoundWikidataComponent;
  let fixture: ComponentFixture<CompoundWikidataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundWikidataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundWikidataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
