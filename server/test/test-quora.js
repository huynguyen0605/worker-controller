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
    // defaultViewport: { width: 500, height: 500 },
    executablePath: chromePath,
    headless: false,
    // args:["--window-size=500,500"],
  });
  const page = await browser.newPage();
  await page.goto(url);
  return { browser, page, waitFor };
}

async function execQuora({ page, waitFor }) {
  /* ==================== login ==================== */
  const email = 'alexgootvn@gmail.com';
  const password = 'Loginquora1';
  // enter email
  const emailSelector = 'input[id="email"]';
  await page.waitForSelector(emailSelector);
  await page.type(emailSelector, email);
  // enter password
  const passwordSelector = 'input[id="password"]';
  await page.waitForSelector(passwordSelector);
  await page.type(passwordSelector, password);
  // click login button
  const loginBtnSelector = '#root > div > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > button';
  const loginBtn = await page.$(loginBtnSelector);
  while(true) {
    const isDisabled = await page.evaluate((button) => button.disabled, loginBtn);
    if (!isDisabled) {
      await page.click(loginBtnSelector);
      break;
    } else {
      await waitFor(1000);
    }
  }
  await page.click(loginBtnSelector);
  
  /* ==================== wait page loading ==================== */
  const waitPageLoading = async () => {
    await page.waitForSelector('#mainContent');
    await waitFor(5000);
    const scrollDuration = 10 * 1000; // 10 seconds in milliseconds
    const scrollInterval = 1000; // Scroll every 1 second
    const startTime = Date.now();
    let currentTime = startTime;
    while (currentTime - startTime < scrollDuration) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitForTimeout(scrollInterval);
      currentTime = Date.now();
    }
  }
  
  /* ==================== sync question ==================== */
  const syncQuestion = async () => {
    const newFeedWrapperSelector = '#mainContent > div > div';
    const newFeedWrapper = await page.$(newFeedWrapperSelector);
    if (newFeedWrapper) {
      const childElements = await newFeedWrapper.$$('div');
      const newFeedChildrens = [];
      // get newfeed component
      for (const childElement of childElements) {
        const isDirectChild = await page.evaluate(
          (childElement, newFeedWrapperSelector) => {
            const parentElement = childElement.parentElement;
            const newFeedWrapper = document.querySelector(newFeedWrapperSelector);
            return parentElement === newFeedWrapper;
          },
          childElement,
          newFeedWrapperSelector
        );
        if (isDirectChild) {
          newFeedChildrens.push(childElement);
        }
      }
      
      if(Array.isArray(newFeedChildrens) && newFeedChildrens.length > 0) {
        for (let i = 0; i < newFeedChildrens.length; i++) {
          if(i === newFeedChildrens.length - 1) {
            const refreshButton = await page.$x("//button[contains(., 'Refresh Page')]");
            if (refreshButton.length > 0) {
              await refreshButton[0].click();
            }
          } else {
            const newFeedChildElements = [];
            const questionChilds = await newFeedChildrens[i].$$('div div:nth-child(2) div');
            if(questionChilds) {
              for (const questionChild of questionChilds) {
                const isDirectChild = await page.evaluate(
                  (questionChild, newFeedWrapperSelector) => {
                    const parentElement = questionChild.parentElement;
                    const wrapperElement = newFeedWrapperSelector.querySelector('div');
                    return parentElement === wrapperElement;
                  },
                  questionChild,
                  newFeedChildrens[i]
                );
                if (isDirectChild) {
                  newFeedChildElements.push(questionChild);
                }
              }
            }
    
            let listQuestionElementsData = []; 
            if(newFeedChildElements[1]) {
              const getListQuestionElement = async (clickMore) => {
                const listQuestionElements = [];
                const listQuestion = await newFeedChildElements[1].$$('div');
                if(listQuestion) {
                  for (const itemQuestion of listQuestion) {
                    const isDirectChild = await page.evaluate(
                      (itemQuestion, itemQuestionWrapperSelector) => {
                        const parentElement = itemQuestion.parentElement;
                        return parentElement === itemQuestionWrapperSelector;
                      },
                      itemQuestion,
                      newFeedChildElements[1]
                    );
                    if (isDirectChild) {
                      listQuestionElements.push(itemQuestion)
                    }
                  }
                }
                if(listQuestionElements.length > 0 && clickMore) {
                  const btnMoreWrapper = listQuestionElements[listQuestionElements.length - 1];
                  const btnMore = await btnMoreWrapper.$('button');
                  if(btnMore) {
                    await btnMore.click();
                  }
                }
                if(listQuestionElements.length > 0 && !clickMore) {
                  return listQuestionElements;
                }
              }
              await getListQuestionElement(true);
              listQuestionElementsData = await getListQuestionElement(false);
            }
            
            const listQuestionObj = [];
            if(listQuestionElementsData.length > 0) {
              for(let i=0; i<listQuestionElementsData.length; i++) {
                const linkElement = await listQuestionElementsData[i].$('a');
                if(linkElement) {
                  const linkContent = await page.evaluate(element => element.getAttribute('href'), linkElement);
                  const textContent = await page.evaluate(linkElement => linkElement.textContent.trim(), linkElement);
                  const questionObj = {
                    linkContent,
                    textContent
                  }
                  if(textContent !== 'View all')
                    listQuestionObj.push(questionObj)
                }
              }
            }
            
            console.log("listQuestionObj: ", listQuestionObj)
            // logic lưu câu hỏi
          }
  
          await waitFor(10000);
        }
      }
    }
  }

  /* ==================== START ==================== */
  while(true) {
    await waitPageLoading();
    await syncQuestion();
  }
}

(async () => {
  const { page, waitFor } = await init({
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://www.quora.com/answer'
  });

  await execQuora({ page, waitFor });
})();

// log item to preview HTML code
// const HTML = await page.evaluate(element => element.outerHTML, btnMoreWrapper);
// console.log('========= questionChild HTML:', HTML);