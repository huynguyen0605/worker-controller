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

async function syncPostFacebook({ page, pageUrl, browser, waitFor, userId, userPass, user2fa }) {
  const limitPost = 5;
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
              content: HTML
            }
            posts.push(data)
          }
        }
      }
    }
    console.log(posts);
    // handle lưu ở đây
  } catch (error) {
    console.log("========> error: ", error)
  }
}

async function scratchDataGroupFacebook({ page, groupUrl, browser, waitFor, userId, userPass, user2fa }) {
  const limitPost = 5;
  try {
    await loginFacebook({ page, browser, waitFor, userId, userPass, user2fa });
    await waitFor(5000);
    await page.goto(groupUrl);
    await waitFor(1000);
    const elementEN = await page.$('div[role="button"][aria-label="Join group"]');
    const elementVN = await page.$('div[role="button"][aria-label="Tham gia nhóm"]');
    if(elementEN || elementVN) {
      if(elementEN) await elementEN.click();
      if(elementVN) await elementVN.click();
      await waitFor(1000);
      await page.reload();
    }
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
    const groupLink = (await page.url()).replace(/\?.*$/, "");
    const postLinks = [];
    while(true) {
      await waitPageLoading();
      const selectedLinks = await page.$$eval('a[href*="' + groupLink + 'posts"]', elements => {
        return elements.map(element => element.href);
      });
      if(selectedLinks) {
        selectedLinks.forEach(link => {
          const newLink = link.replace(/\?.*$/, "");
          if(!postLinks.includes(newLink)) {
            postLinks.push(newLink);
          }
        })
      }
      if(postLinks.length >= limitPost) break;
    }
    const posts = [];
    for(const [indexLink, postLink] of postLinks.entries()) {
      await page.goto(postLink);
      await waitFor(2000);
      let postWrapperSelector;
      const regex = /groups\/(\d+)\/?/;
      const match = postLink.match(regex);
      if (match) {
        postWrapperSelector = "body > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > div:nth-child(4) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div"
      } else {
        postWrapperSelector = "body > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > div > div:nth-child(1) > div > div:nth-child(3) > div > div > div:nth-child(4) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div";
      }
      const postWrappers = await page.$$(postWrapperSelector);
      if(postWrappers) {
        for (const [index, postWrapper] of postWrappers.entries()) {
          const isTrueElement = await page.evaluate(el => {
            return el.getAttribute('class') === null && el.childElementCount > 0;
          }, postWrapper);
          if(isTrueElement) {
            const childElementSelector = postWrapperSelector + ':nth-child(' + (index + 1) + ') > div > div > div:nth-child(3)';
            const childElement = await page.$(childElementSelector);
            const HTML = await page.evaluate(element => element.outerHTML, childElement); 
            if(HTML) {
              const data = {
                url: postLink,
                content: HTML
              }
              posts.push(data)
            }
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
      const inputCommentSelector = 'div[contenteditable="true"][spellcheck="true"]'
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

// 100094027966193|RTvSEOqt7NuLrp|LACQOLLZTEYO4576X4VHV7C4NO74DIYO|dylanmiortega@hotmail.com|h2vIt67zhv
(async () => {
  const { browser, page, waitFor } = await init({
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://www.facebook.com/',
  });
  // ==============================================
  // await syncPostFacebook({
  //   page,
  //   browser,
  //   waitFor,
  //   userId: "100094027966193", 
  //   userPass: "RTvSEOqt7NuLrp", 
  //   user2fa: "LACQOLLZTEYO4576X4VHV7C4NO74DIYO", 
  //   pageUrl: "https://www.facebook.com/nhungcaunoibathu"
  // })
  // ==============================================
  await scratchDataGroupFacebook({
    page, 
    browser, 
    waitFor,
    userId: "100094027966193", 
    userPass: "RTvSEOqt7NuLrp", 
    user2fa: "LACQOLLZTEYO4576X4VHV7C4NO74DIYO",
    // groupUrl: "https://www.facebook.com/groups/1359432470795770/"
    // groupUrl: "https://www.facebook.com/groups/nghiencon.gr/"
    groupUrl: "https://www.facebook.com/groups/mebimsuachiasemeonuoicon/"
  })
  // ==============================================
  // await commentPostFacebook({
  //   page,
  //   browser,
  //   waitFor,
  //   userId: "100094027966193", 
  //   userPass: "RTvSEOqt7NuLrp", 
  //   user2fa: "LACQOLLZTEYO4576X4VHV7C4NO74DIYO",
  //   dataReplyPosts: [
  //     {
  //       url: "https://www.facebook.com/groups/1359432470795770/posts/25014009574911394/",
  //       comment: "Vì bạn xứng đáng :D"
  //     }
  //   ]
  // })
})();
