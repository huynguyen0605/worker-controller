const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');
const { firstName, surName, wordList } = require('./fileName');

/* =========================================== */

const waitFor = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

function generatingName() {
  const selectedFirstName = firstName[Math.floor(Math.random() * firstName.length)];
  const selectedSurName = surName[Math.floor(Math.random() * surName.length)];

  return `${selectedFirstName} ${selectedSurName}`;
}

function generateUsername(
  size = 8,
  chars = 'abcdefghijklmnopqrstuvwxyz' + (Math.random() < 0.5 ? '.' : '_'),
) {
  wordList.push(...chars);
  let resultUsername = 'x'.repeat(100); // Init username as dummy words

  while (resultUsername.length < size || resultUsername.length >= 30) {
    // Case 0: Combination of words
    const nWord = Math.floor(Math.random() * 2) + 1;
    let targetWordList = Array.from({ length: nWord }, () =>
      wordList[Math.floor(Math.random() * wordList.length)].toLowerCase(),
    );

    // Case 1: Flip each word (5%)
    targetWordList = targetWordList.map((targetWord) =>
      Math.random() < 0.03 ? targetWord.split('').reverse().join('') : targetWord,
    );

    // Case 2: Replace character to 'x' or 'y' or number (3%)
    targetWordList = targetWordList.map((targetWord) =>
      targetWord
        .split('')
        .map((char) => (Math.random() < 0.03 ? (Math.random() < 0.5 ? 'x' : 'y') : char))
        .join(''),
    );

    // Case 3: Repeat last character (7%, 1~4 times)
    targetWordList = targetWordList.map((targetWord) =>
      Math.random() < 0.07
        ? targetWord + targetWord.slice(-1).repeat(Math.floor(Math.random() * 4) + 1)
        : targetWord,
    );

    // Case 4: Join the words with '.' or '_'
    const joiningChar = Math.random() < 0.5 ? '.' : '_';
    resultUsername = targetWordList.join(joiningChar);

    // Case 5: Add some number to end (30%, 1~999999)
    if (Math.random() < 0.3) {
      if (Math.random() < 0.6) {
        resultUsername += joiningChar;
      }

      const additionalNumberList = [];
      const numberList = Array.from({ length: 10 }, (_, i) => String(i));
      additionalNumberList.push(numberList[Math.floor(Math.random() * 10)]);
      additionalNumberList.push(
        ...Array.from({ length: 5 }, () => numberList[Math.floor(Math.random() * 10)]),
      );
      resultUsername += additionalNumberList.join('');
    }
  }

  return resultUsername;
}

async function checkValidName(page) {
  while (true) {
    try {
      // Wait until the element is present in the DOM
      const elementPresent = await page.waitForSelector(
        'body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div:nth-child(2) > form > div:nth-child(6) > div > div > span',
        { timeout: 5000 },
      );

      // If the element is present, perform your actions here
      if (elementPresent) {
        const button = await page.waitForSelector(
          'body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div:nth-child(2) > form > div:nth-child(6) > div > div > div > button',
          { timeout: 5000 },
        );
        await button.click();
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('checkValidName: ', error);
      break;
    }
  }
}

const generatePassword = (passwd) => {
  if (passwd === undefined || passwd === null) {
    const passwordCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length: 12 },
      () => passwordCharacters[Math.floor(Math.random() * passwordCharacters.length)],
    ).join('');
  } else {
    return passwd;
  }
};

async function getFakeMail() {
  const url = 'https://email-fake.com/';
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const mail = $('#email_ch_text').text();
    return mail;
  } catch (error) {
    console.error('Error fetching fake mail:', error.message);
    return null;
  }
}

async function getInstVeriCode(mailName, domain) {
  const INST_CODE = `https://email-fake.com/${domain}/${mailName}`;
  const browser = await puppeteer.launch();
  const newPage = await browser.newPage();
  await newPage.goto(INST_CODE);

  while (true) {
    const title = await newPage.title();

    if (title.slice(0, 4) === 'Fake') {
      await newPage.reload();
      console.log(title);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      const code = title.slice(0, 6);
      await newPage.close();
      console.log(code);
      break;
    }
  }

  await browser.close();
}

async function getInstVeriCodeDouble(mailName, domain, oldCode) {
  const INST_CODE = `https://email-fake.com/${domain}/${mailName}`;
  const browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();

  await page.goto(INST_CODE);
  await page.waitForTimeout(4000);

  let code = await page.$eval(
    'html > body > div:nth-child(3) > div > div > div:nth-child(1) > div:nth-child(2) > a:nth-child(1) > div:nth-child(2)',
    (element) => element.textContent,
  );

  while (oldCode === code) {
    await page.reload();
    console.log('Wait for new code!');
    await page.waitForTimeout(1000);
    code = await page.$eval(
      '#email-table > div:nth-child(2) > div:nth-child(1) > div > h1',
      (element) => element.textContent,
    );
  }

  const codeNew = code.slice(0, 6);
  await browser.close();
  return codeNew;
}

/* =========================================== */

async function init({ chromePath, url, proxyServer }) {
  let totalDownloadedSize = 0;
  // const oldProxyUrl = 'http://rsjfyami:y1psgav7cwfd@185.199.228.220:7300';
  const oldProxyUrl = 'http://mpdthaat:9bixgazxdtt6@45.94.47.66:8110'
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    args: [`--incognito`, `--proxy-server=${newProxyUrl}`],
  });

  // =================

  const page = await browser.newPage();
  await page.goto(url);
  // Enable request interception
  await page.setRequestInterception(true);
  // Listen to the 'response' event to track downloaded resources
  page.on('response', (response) => {
    const contentLength = response.headers()['content-length'];
    if (contentLength) {
      totalDownloadedSize += parseInt(contentLength);
    }
  });
  await waitFor(8000);

  // =================

  // Fill the email value
  const fake_email = await getFakeMail();
  await page.type('input[name="emailOrPhone"]', fake_email);
  console.log('fake_email: ', fake_email);

  // Fill the fullname value
  const username = generatingName();
  await page.type('input[name="fullName"]', username);
  console.log('username', username);

  // Fill username value
  const name = generateUsername();
  await page.type('input[name="username"]', name);
  console.log('name: ', name);

  // Fill password value
  const acc_password = generatePassword();
  await page.type('input[name="password"]', acc_password);
  console.log(`account: ${name}:${acc_password}`);

  // save account to file
  await fs.appendFile('accounts.txt', `${name}:${acc_password} - ${fake_email}\n`);

  // click btn sign up
  await page.click(
    'body div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) div:nth-child(2) > form > div:nth-child(9) > div > button',
  );

  // =================

  await page.waitForTimeout(8000);
  await checkValidName(page);
  await page.waitForTimeout(80000);

  // =================

  // Birthday verification
  
  // select date
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(1) > select');
  await page.waitForSelector('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(1) > select > option:nth-child(1)', { visible: true, timeout: 1000 });
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(1) > select');

  // Select month
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(2) > select');
  await page.waitForSelector('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(2) > select > option:nth-child(10)', { visible: true, timeout: 1000 });
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(2) > select > option:nth-child(10)');

  // Select year
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(3) > select');
  await page.waitForSelector('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(3) > select > option:nth-child(10)', { visible: true, timeout: 1000 });
  await page.click('body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(4) > div > div > span > span:nth-child(3) > select > option:nth-child(10)');

  await page.click(
    'body > div:nth-child(2) > div > div > div:nth-child(2) > div > div > div:nth-child(1) > section > main > div > div > div:nth-child(1) > div > div:nth-child(6) > button',
  );
  await page.waitForTimeout(3000);

  // get info 
  const fMail = fake_email.split('@');
  const mailName = fMail[0];
  const domain = fMail[1];
  const instCode = await getInstVeriCode(mailName, domain);
  await page.type('input[name="email_confirmation_code"]', instCode);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(10000);

  // Accepting the notifications.
  await page.click('html > body > div:nth-child(4) > div > div > div > div:nth-child(3) > button:nth-child(2)');
  await page.waitForTimeout(20000);

  // Logout
  await page.click('#react-root > section > nav > div:nth-child(2) > div > div > div:nth-child(3) > div > div:nth-child(5) > span > img');
  await page.click('#react-root > section > nav > div:nth-child(2) > div > div > div:nth-child(3) > div > div:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div');

  await page.click(
    '#react-root > section > nav > div:nth-child(2) > div > div > div:nth-child(3) > div > div:nth-child(5) > span > img',
  );
  await page.click(
    '#react-root > section > nav > div:nth-child(2) > div > div > div:nth-child(3) > div > div:nth-child(5) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div',
  );

  try {
    const not_valid = await page.$(
      'body > div:nth-child(1) > section > main > div > div > div > div:nth-child(2) > form > div > div:nth-child(4) > div',
    );
    if (
      not_valid &&
      (await not_valid.evaluate((node) => node.innerText)) ===
        "That code isn't valid. You can request a new one."
    ) {
      await page.waitForTimeout(1000);
      await page.click(
        'body > div:nth-child(1) > section > main > div > div > div > div:nth-child(1) > div:nth-child(2) > div > button',
      );
      await page.waitForTimeout(10000);
      const instCodeNew = await getInstVeriCodeDouble(mailName, domain, page, instCode);
      const confInput = await page.$('input[name="email_confirmation_code"]');
      await confInput.click({ clickCount: 3 });
      await confInput.press('Backspace');
      await confInput.type(instCodeNew);
      await confInput.press('Enter');
    }
  } catch (error) {
    // Handle the case when the element is not found within the specified timeout
    console.log('');
  }

  // await page.waitForTimeout(5000);
  // await browser.close();
}

/* =========================================== */

(async () => {
  // for(let i = 0; i <= 1000; i++ ) {
  await init({
    chromePath: 'C:\Users\nguye\OneDrive\Documents\Projects\instagram-auto-create-account\chromedriver.exe',
    url: 'https://www.instagram.com/accounts/emailsignup/',
    proxyServer: 'http://rsjfyami:y1psgav7cwfd@38.154.227.167:5868',
  });
  // }
})();
