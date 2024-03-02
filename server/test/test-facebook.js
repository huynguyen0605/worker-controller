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

async function loginFacebook({ page, browser, waitFor, userId, userPass, user2fa }) {
  const fbEmailSelector = 'input[type="text"][name="email"]';
  await page.waitForSelector(fbEmailSelector, {
    visible: true,
    timeout: 20000,
  });
  await page.focus(fbEmailSelector);
  await page.type(fbEmailSelector, userId);
  await waitFor(700);
  const fbPasswordSelector = 'input[type="password"][name="pass"]';
  await page.focus(fbPasswordSelector);
  await page.type(fbPasswordSelector, userPass);
  await waitFor(1000);
  // const fbButtonLogin = 'input[type="submit"][name="login"]';
  const fbButtonLogin = 'button[type="submit"][name="login"]';
  await page.click(fbButtonLogin);
  await waitFor(2000);
  const authPage = await browser.newPage();
  await authPage.goto('https://2fa.live');
  const authTokenSelector = 'textarea[id="listToken"]';
  await authPage.waitForSelector(authTokenSelector, { timeout: 10000 });
  await authPage.focus(authTokenSelector);
  await authPage.type(authTokenSelector, user2fa);
  await waitFor(1000);
  const authButtonSubmit = 'a[id="submit"]';
  await authPage.click(authButtonSubmit);
  await waitFor(1000);
  const authResultSelector = 'textarea[id="output"]';
  const outputValue = await authPage.$eval(authResultSelector, (textarea) => textarea.value);
  const code = outputValue.split('|')[1];
  await authPage.close();
  await waitFor(3000);
  const fbCodeSelector = 'input[type="text"][id="approvals_code"]';
  await page.focus(fbCodeSelector);
  await page.type(fbCodeSelector, code);
  await waitFor(2000);
  // const fbCodeSubmitSelector = 'input[id="checkpointSubmitButton-actual-button"]';
  const fbCodeSubmitSelector = 'button[id="checkpointSubmitButton"]';
  await page.click(fbCodeSubmitSelector);
  await waitFor(3000);
  await page.click(fbCodeSubmitSelector);
  const url = await page.url();
  if (url.includes('checkpoint/disabled')) {
    // handle when acc facebook to be checkpoint/disabled
    throw new Error('not pass login');
  } else {
    console.log('pass login');
  }
  try {
    await page.waitForSelector(fbCodeSubmitSelector, { timeout: 5000 });
    await waitFor(2000);
    await page.click(fbCodeSubmitSelector);
    await page.waitForSelector(fbCodeSubmitSelector, { timeout: 5000 });
    await waitFor(2000);
    await page.click(fbCodeSubmitSelector);
    await page.waitForSelector(fbCodeSubmitSelector, { timeout: 5000 });
    await waitFor(2000);
    await page.click(fbCodeSubmitSelector);
  } catch (error) {
    console.log('no checkpoint button');
  }
}

const fs = require('fs');

async function syncPostFacebook({ page, pageUrl, browser, waitFor, userId, userPass, user2fa }) {
  const limitPost = 50;
  try {
    await loginFacebook({ page, browser, waitFor, userId, userPass, user2fa });
    await waitFor(5000);
    await page.goto(pageUrl);
    await waitFor(1000);
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
    const postLinks = [];
    while (true) {
      await waitPageLoading();
      const selectedLinks = await page.$$eval('a[href*="' + pageUrl + '/posts"]', (elements) => {
        return elements.map((element) => element.href);
      });
      if (selectedLinks) {
        selectedLinks.forEach((link) => {
          const newLink = link.replace(/\?.*$/, '');
          if (!postLinks.includes(newLink)) {
            postLinks.push(newLink);
          }
        });
      }
      if (postLinks.length >= limitPost) break;
    }
    const posts = [];
    for (const [indexLink, postLink] of postLinks.entries()) {
      await page.goto(postLink);
      await waitFor(2000);
      const postWrapperSelector =
        'body > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(1) > div > div > div > div > div > div > div > div > div > div > div > div > div > div';
      const postWrappers = await page.$$(postWrapperSelector);
      if (postWrappers) {
        for (const [index, postWrapper] of postWrappers.entries()) {
          const isTrueElement = await page.evaluate((el) => {
            return el.getAttribute('class') === null && el.childElementCount > 0;
          }, postWrapper);
          if (isTrueElement) {
            const childElementSelector =
              postWrapperSelector +
              ':nth-child(' +
              (index + 1) +
              ') > div > div > div:nth-child(3)';
            const childElement = await page.$(childElementSelector);
            const HTML = await page.evaluate((element) => element.outerHTML, childElement);
            const data = {
              url: postLink,
              content: HTML,
            };
            posts.push(data);
          }
        }
      }
    }
    console.log(posts);
  } catch (error) {
    console.log('========> error: ', error);
  }
}

async function commentPostFacebook({
  page,
  dataReplyPosts,
  browser,
  waitFor,
  userId,
  userPass,
  user2fa,
}) {
  try {
    await loginFacebook({ page, browser, waitFor, userId, userPass, user2fa });
    await waitFor(5000);
    for (const [index, dataReplyPost] of dataReplyPosts.entries()) {
      await page.goto(dataReplyPost.url);
      await waitFor(2000);
      const inputCommentSelector = 'div[aria-label="Write a comment…"]';
      const inputComment = await page.$(inputCommentSelector);
      await inputComment.type(dataReplyPost.comment);
      const submitBtn = await page.$('#focused-state-composer-submit');
      await submitBtn.click();
    }
  } catch (error) {
    console.log('========> error: ', error);
  }
}

// log item to preview HTML code
// const HTML = await page.evaluate(element => element.outerHTML, btnMoreWrapper);
// console.log('========= HTML:', HTML);

// 100093513507075|HulQ1xFu4s8RVd|YSVLMJKYOYJBF53MUK2C5ILRKVEZW3YK|carterpeters5x8@hotmail.com|zioOyuj7vtz - checkpoint
// 100093602717813|xldnKeq6116n60|SWY5D37MR6Z4V3U3GMVUGQXSTJGV5WUW|julian0etberry@hotmail.com|RMc74b6Dx - ok
(async () => {
  const { browser, page, waitFor } = await init({
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://www.facebook.com/',
  });
  // await syncPostFacebook({
  //   page,
  //   browser,
  //   waitFor,
  //   userId: "100093602717813",
  //   userPass: "xldnKeq6116n60",
  //   user2fa: "SWY5D37MR6Z4V3U3GMVUGQXSTJGV5WUW",
  //   pageUrl: "https://www.facebook.com/nhungcaunoibathu"
  // })
  await commentPostFacebook({
    page,
    browser,
    waitFor,
    userId: '100093602717813',
    userPass: 'xldnKeq6116n60',
    user2fa: 'SWY5D37MR6Z4V3U3GMVUGQXSTJGV5WUW',
    dataReplyPosts: [
      {
        url:
          'https://www.facebook.com/nhungcaunoibathu/posts/pfbid023jn7eF2PeRGgEgxn1jymMK4h7mUCN5aG91bXsxQPWDgRz2V6hwGuVFmZrEYQ5zBHl',
        comment: 'Vì bạn xứng đáng :D',
      },
    ],
  });
})();
