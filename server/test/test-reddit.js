async function init({ chromePath, url }) {
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
  const pages = await browser.pages();
  const page = pages[0];
  await page.goto(url);
  return { browser, page, waitFor };
}

async function loginReddit({ page, waitFor, username, password }) {
  const btnLogin = 'a[id="login-button"]';
  await page.click(btnLogin);
  const inputUsername = 'input[name="username"][type="text"]';
  await page.waitForSelector(inputUsername);
  await page.type(inputUsername, username);
  const inputPassword = 'input[name="password"][type="password"]';
  await page.waitForSelector(inputPassword);
  await page.type(inputPassword, password);
  await waitFor(1500);
  await page.keyboard.press('Enter');
}

// log item to preview HTML code
// const HTML = await page.evaluate(element => element.outerHTML, btnMoreWrapper);
// console.log('========= HTML:', HTML);

// Salt_Librarian8432 / Loginreddit123
(async () => {
  const { browser, page, waitFor } = await init({
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://www.reddit.com',
  });
  await loginReddit({
    page, 
    waitFor, 
    username: "Salt_Librarian8432", 
    password: "Loginreddit123"
  })
})();
