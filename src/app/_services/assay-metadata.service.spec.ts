import { TestBed, inject } from '@angular/core/testing';

import { AssayMetadataService } from './assay-metadata.service';

describe('AssayMetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssayMetadataService]
    });
  });

  it('should be created', inject([AssayMetadataService], (service: AssayMetadataService) => {
    expect(service).toBeTruthy();
  }));
});
