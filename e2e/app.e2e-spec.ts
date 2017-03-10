import { DrugPortalPage } from './app.po';

describe('drug-portal App', () => {
  let page: DrugPortalPage;

  beforeEach(() => {
    page = new DrugPortalPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
