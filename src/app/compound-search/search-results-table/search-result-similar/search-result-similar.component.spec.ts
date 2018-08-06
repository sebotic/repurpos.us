import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultSimilarComponent } from './search-result-similar.component';

describe('SearchResultSimilarComponent', () => {
  let component: SearchResultSimilarComponent;
  let fixture: ComponentFixture<SearchResultSimilarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchResultSimilarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultSimilarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
