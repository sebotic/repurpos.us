import { CompoundDataModule } from './compound-data.module';

describe('CompoundDataModule', () => {
  let compoundDataModule: CompoundDataModule;

  beforeEach(() => {
    compoundDataModule = new CompoundDataModule();
  });

  it('should create an instance', () => {
    expect(compoundDataModule).toBeTruthy();
  });
});
