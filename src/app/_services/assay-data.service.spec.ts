import { TestBed, inject } from '@angular/core/testing';

import { AssayDataService } from './assay-data.service';

describe('AssayDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssayDataService]
    });
  });

  it('should be created', inject([AssayDataService], (service: AssayDataService) => {
    expect(service).toBeTruthy();
  }));
});
