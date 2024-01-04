const wrap = (s) => '{ return ' + s + ' };';

const loginFacebook = () => {
  const emailInput = 'input[name="email"]';
  const passwordInput = 'input[name="pass"]';
  const loginInput = 'input[name="login"]';
};

(async () => {
  const initBody = `async function init({ chromePath, url }) {
    const puppeteer = await import('puppeteer');
    const waitFor = async (time) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, time);
      });
    };
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: false,
      args: ['--incognito'],
    });
    const context = await browser.createIncognitoBrowserContext();
    const fbPage = await context.newPage();
    fbPage.setViewport({ width: 1280, height: 900 });
    await fbPage.goto(url);
    return { browser, fbPage, waitFor };
  }`;
  const executeInit = new Function(wrap(initBody));

  const { fbPage, waitFor } = await executeInit.call(null).call(null, {
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://mbasic.facebook.com',
  });
})();
