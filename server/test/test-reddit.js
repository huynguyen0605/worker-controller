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

async function scratchDataCommunitiesReddit({ page, waitFor, username, password, communityUrl }) {
  const limitPost = 5;
  try {
    await loginReddit({ page, waitFor, username, password });
    await waitFor(3000);
    await page.goto(communityUrl);
    await waitFor(3000);
    const subreddit = communityUrl.substring(communityUrl.indexOf("/r/"), communityUrl.indexOf("/", communityUrl.indexOf("/r/") + 3) + 1);
    const waitPageLoading = async () => {
      let scrolledHeight = 0;
      const scrollDuration = 10 * 1000;
      const scrollInterval = 1000;
      const startTime = Date.now();
      let currentTime = startTime;
      while (currentTime - startTime < scrollDuration) {
        await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });
        await waitFor(scrollInterval);
        const newScrolledHeight = await page.evaluate(() => document.body.scrollHeight);
        if (newScrolledHeight === scrolledHeight) {
          break;
        }
        scrolledHeight = newScrolledHeight;
        currentTime = Date.now();
      }
    };
    const commentLinks = [];
    while (true) {
      await waitPageLoading();
      const selectedLinks = await page.$$eval(
        'a[href*="' + subreddit + 'comments"]', 
        elements => elements.map(element => element.href)
      );
      if (selectedLinks) {
        selectedLinks.forEach((link) => {
          const newLink = link.replace(/\?.*$/, '');
          if (!commentLinks.includes(newLink)) {
            commentLinks.push(newLink);
          }
        });
      }
      if (commentLinks.length >= limitPost) break;
    }
    // for (const [index, commentLink] of commentLinks.entries()) {
      await page.goto(commentLinks[0]);
      await waitFor(2000);
    // }
  } catch (error) {
    console.log('========> error: ', error);
  }
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
  await scratchDataCommunitiesReddit({
    page, 
    waitFor, 
    username: "Salt_Librarian8432", 
    password: "Loginreddit123",
    communityUrl: "https://www.reddit.com/r/Health/"
  })
})();
