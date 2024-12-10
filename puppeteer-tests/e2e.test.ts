import puppeteer from 'puppeteer-core';

describe('E2E app tests', () => {
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

  test('User can log in and open Profile', async () => {
    await page.goto('http://localhost:3000/login');
    await page.type('input[type="email"]', 'ar@chitect.com');
    await page.type('input[type="password"]', 'abc123');
    await page.click('button[type="submit"]');

    await page.waitForNavigation();
    expect(await page.url()).toContain('/projects');

    const profileLink = await page.$('a[href="/profile"]');
    expect(profileLink).not.toBeNull();

    if (profileLink) {
      await profileLink.click();
      expect(page.url()).toContain('/profile');
    }
  });

  test('User cannot access Profile screen when not logged in', async () => {
    await page.goto('http://localhost:3000/profile');
    expect(await page.url()).toContain('/profile');
    await page.waitForNavigation();
    expect(await page.url()).toContain('/login');
  });

  test('User cannot access Login screen when logged in', async () => {
    await page.goto('http://localhost:3000/projects');
    await page.waitForNavigation();
    expect(await page.url()).toContain('/projects');

    await page.goto('http://localhost:3000/login');
    expect(await page.url()).toContain('/login');
    await page.waitForSelector('img[alt="Profile Picture"]');
    expect(await page.url()).toContain('/profile');
  });

  test('User can open their existing project when logged in', async () => {
    await page.goto('http://localhost:3000/projects');
    await page.waitForNavigation();
    expect(await page.url()).toContain('/projects');

    const projectButton = await page.$('div[role="button"].project-wrapper');
    expect(projectButton).not.toBeNull();

    if (projectButton) {
      await projectButton.click();
      await page.waitForSelector('div.editor');
      expect(await page.$('div.editor')).not.toBeNull();
    }

  });
});
