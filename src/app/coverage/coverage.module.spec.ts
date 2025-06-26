import { CoverageModule } from './coverage.module';

describe('CoverageModule', () => {
  let coverageModule: CoverageModule;

  beforeEach(() => {
    coverageModule = new CoverageModule();
  });

  it('should create an instance', () => {
    expect(coverageModule).toBeTruthy();
  });
});
