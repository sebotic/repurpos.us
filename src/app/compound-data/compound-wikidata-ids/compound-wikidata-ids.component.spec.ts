import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundWikidataIdsComponent } from './compound-wikidata-ids.component';

describe('CompoundWikidataIdsComponent', () => {
  let component: CompoundWikidataIdsComponent;
  let fixture: ComponentFixture<CompoundWikidataIdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundWikidataIdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundWikidataIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
