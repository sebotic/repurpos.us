import { TestBed, inject } from '@angular/core/testing';

import { CitationService } from './citation.service';

describe('CitationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitationService]
    });
  });

  it('should be created', inject([CitationService], (service: CitationService) => {
    expect(service).toBeTruthy();
  }));
});
