import { Struct2dModule } from './struct2d.module';

describe('Struct2dModule', () => {
  let struct2dModule: Struct2dModule;

  beforeEach(() => {
    struct2dModule = new Struct2dModule();
  });

  it('should create an instance', () => {
    expect(struct2dModule).toBeTruthy();
  });
});
