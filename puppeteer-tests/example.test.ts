import puppeteer from 'puppeteer-core';

describe('Example Test', () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      executablePath:
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('App loads and navigates to the Editor screen', async () => {
    await page.goto('http://localhost:3000');
    expect(await page.title()).toBe('ARchitect');

    const editorLink = await page.$('a[href="/editor"]');
    expect(editorLink).not.toBeNull();

    if (editorLink) {
      await editorLink.click();
      await page.waitForNavigation();
      expect(page.url()).toContain('/editor');
    }
  });

  test('User can log in', async () => {
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', 'ar@chitect.com');
    await page.type('input[type="password"]', 'abc123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation();
    expect(await page.url()).toContain('/projects');
  });
});
