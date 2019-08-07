import { AssayDataModule } from './assay-data.module';

describe('AssayDataModule', () => {
  let assayDataModule: AssayDataModule;

  beforeEach(() => {
    assayDataModule = new AssayDataModule();
  });

  it('should create an instance', () => {
    expect(assayDataModule).toBeTruthy();
  });
});
