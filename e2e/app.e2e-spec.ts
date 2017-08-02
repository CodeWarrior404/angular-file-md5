import { AngularFileMd5Page } from './app.po';

describe('angular-file-md5 App', () => {
  let page: AngularFileMd5Page;

  beforeEach(() => {
    page = new AngularFileMd5Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
