import { AssaysModule } from './assays.module';

describe('AssaysModule', () => {
  let assaysModule: AssaysModule;

  beforeEach(() => {
    assaysModule = new AssaysModule();
  });

  it('should create an instance', () => {
    expect(assaysModule).toBeTruthy();
  });
});
