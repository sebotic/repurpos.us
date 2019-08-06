import { CitationModule } from './citation.module';

describe('CitationModule', () => {
  let citationModule: CitationModule;

  beforeEach(() => {
    citationModule = new CitationModule();
  });

  it('should create an instance', () => {
    expect(citationModule).toBeTruthy();
  });
});
