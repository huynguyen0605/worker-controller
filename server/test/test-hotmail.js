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
  const context = await browser.createIncognitoBrowserContext();
  const fbPage = await context.newPage();
  fbPage.setViewport({ width: 300, height: 300 });
  await fbPage.goto(url);
  return { browser, fbPage, waitFor };
}

async function signHotmail({ fbPage, waitFor }) {
  const emailSelector = 'input[class="ltr_override form-control email-input-max-width"]';
  const email = 'alexgootvn12@hotmail.com';
  const password = 'BinhHuy@0605';
  const firstName = 'Huy';
  const lastName = 'Quang';
  await fbPage.waitForSelector(emailSelector, { timeout: 10000 });
  await fbPage.type(emailSelector, email);
  const buttonNextSelector = 'input[id="iSignupAction"]';
  await fbPage.click(buttonNextSelector, { timeout: 10000 });
  const passwordSelector = 'input[id="PasswordInput"]';
  await fbPage.waitForSelector(passwordSelector, { timeout: 10000 });
  await fbPage.type(passwordSelector, password);
  const buttonSignUpSelector = 'input[id="iSignupAction"]';
  await fbPage.click(buttonSignUpSelector, { timeout: 10000 });
  const firstNameSelector = 'input[id="FirstName"]';
  await fbPage.waitForSelector(firstNameSelector, { timeout: 10000 });
  await fbPage.type(firstNameSelector, 'Huy');
  const lastNameSelector = 'input[id="LastName"]';
  await fbPage.type(lastNameSelector, 'Quang');
  await fbPage.click(buttonNextSelector, { timeout: 10000 });
  const monthSelector = 'select[id="BirthMonth"]';
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const randomMonthIndex = Math.floor(Math.random() * 12) + 1;
  const randomMonth = months[randomMonthIndex - 1];
  await fbPage.waitForSelector(monthSelector, { timeout: 10000 });
  await fbPage.select(monthSelector, randomMonth);
  const daySelector = 'select[id="BirthDay"]';
  const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  const randomDayIndex = Math.floor(Math.random() * 15) + 1;
  const randomDay = days[randomDayIndex - 1];
  await fbPage.waitForSelector(daySelector, { timeout: 10000 });
  await fbPage.select(daySelector, randomDay.toString());
  const yearSelector = 'input[id="BirthYear"]';
  const years = [
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
  ];
  const randomYearIndex = Math.floor(Math.random() * 12) + 1;
  const randomYear = years[randomYearIndex - 1];
  await fbPage.waitForSelector(yearSelector, { timeout: 10000 });
  await fbPage.type(yearSelector, randomYear.toString());
  await fbPage.waitForSelector(buttonNextSelector);
  await fbPage.click(buttonNextSelector);
  const iframeSelector = 'iframe[id="enforcementFrame"]'; // Adjust this selector based on your actual structure
  const iframe1Element = await fbPage.waitForSelector(iframeSelector);
  await waitFor(1000);
  const frame1 = await iframe1Element.contentFrame();
  console.log('wait frame1 done');
  const iframe2Selector = 'iframe[title="Verification challenge"]';
  const iframe2Element = await frame1.waitForSelector(iframe2Selector);
  await waitFor(1000);
  const frame2 = await iframe2Element.contentFrame();
  console.log('wait frame 2 done');
  const iframe3Selector = 'iframe[id="game-core-frame"]';
  const iframe3Element = await frame2.waitForSelector(iframe3Selector);
  await waitFor(1000);
  const frame3 = await iframe3Element.contentFrame();
  console.log('wait for frame 3 done');
  const buttonNextSelector2 = 'button[data-theme="home.verifyButton"]';
  await frame3.waitForSelector(buttonNextSelector2, { timeout: 30000 });
  await frame3.click(buttonNextSelector2);
  console.log('button clicked', fbPage, frame3);
  let capchaNumericalImageSelector = 'img[aria-label="Image 1 of 5."]';
  let capchaFingerSelector = 'img[aria-live="assertive"]';
  let capchaImageSelector = capchaNumericalImageSelector;
  let capchaType = 'numericalmatch';

  let isValidatingCapcha = true;
  while (isValidatingCapcha) {
    try {
      await frame3.waitForSelector(capchaNumericalImageSelector, { timeout: 3000 });
    } catch (error) {
      try {
        await frame3.waitForSelector(capchaFingerSelector, { timeout: 3000 });
        capchaImageSelector = capchaFingerSelector;
        capchaType = '3d_rollball_objects';
      } catch (error) {
        const [tryAgainButton] = await frame3.$x("//button[contains(., 'Try again')]");
        if (tryAgainButton) {
          tryAgainButton.click();
        } else {
          isValidatingCapcha = false;
          break;
        }
      }
    }
    console.log('captcha selector showed');
    const blob = await frame3.evaluate(async (selector) => {
      const element = document.querySelector(selector); // Get the background image URL after the image has loaded
      const style = window.getComputedStyle(element);
      console.log(style, style.backgroundImage);
      const imageUrl = style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
      const innerUrl = imageUrl
        .replaceAll('url', '')
        .replaceAll('"', '')
        .replaceAll('(', '')
        .replaceAll(')', '');
      const response = await fetch(innerUrl);
      console.log('huynvq::===========>', response);
      const buffer = await response.arrayBuffer();
      console.log('huynvq::===========>buffer', buffer);
      const base64String = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
      );
      return base64String;
    }, capchaImageSelector); // Check if there's a match and get the captured URL
    const decodedBuffer = Buffer.from(blob, 'base64');
    const recreatedBlob = new Blob([decodedBuffer], { type: 'application/octet-stream' });
    console.log('huynvq::==========>recreatedBlob', recreatedBlob);
    const formData = new FormData();
    formData.append('file', recreatedBlob);
    formData.append('method', 'post');
    formData.append('json', '1');
    formData.append('imginstructions', capchaType);
    formData.append('key', 'dbdb45911daf4743c2b1908bc788a413');
    const url = 'http://103.179.189.15:3000';
    try {
      const response = await fetch(url + '/in.php', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Request failed. Status ' + response.status);
      }
      const responseBody = await response.json();
      const { status, request } = responseBody;
      if (status == 1) {
        const responseSolve = await fetch(
          url + '/res.php?key=dbdb45911daf4743c2b1908bc788a413&action=get&json=1&id=' + request,
        );
        const responseSolveBody = await responseSolve.json();

        const nextImageSelector = 'a[aria-label="Navigate to next image"]';
        const step = Number(responseSolveBody.request);
        for (let i = 1; i < step; i++) {
          await frame3.click(nextImageSelector);
          await waitFor(500);
        }

        // Query the button within the iframe's document by its text content
        const [submitButton] = await frame3.$x("//button[contains(., 'Submit')]");
        if (submitButton) {
          submitButton.click();
        }
        console.log('huynvq::==============>responseSolveBody', responseSolveBody);
      }
    } catch (error) {
      console.error('Error sending request:', error.message);
    }
  }
  await waitFor(3000);
  await fbPage.goto('https://www.facebook.com/');
  const fbCreateAccountSelector = 'a[data-testid="open-registration-form-button"]';
  await fbPage.waitForSelector(fbCreateAccountSelector);
  await fbPage.click(fbCreateAccountSelector);

  const fbFirstNameSelecotr = 'input[name="firstname"]';
  await fbPage.waitForSelector(fbFirstNameSelecotr);
  await fbPage.type(fbFirstNameSelecotr, firstName);

  const fbLastNameSelector = 'input[name="lastname"]';
  await fbPage.type(fbLastNameSelector, lastName);

  const fbEmailSelector = 'input[name="reg_email__"]';
  await fbPage.type(fbEmailSelector, email);

  const fbEmail2Selector = 'input[name="reg_email_confirmation__"]';
  await fbPage.waitForSelector(fbEmail2Selector);
  await fbPage.type(fbEmail2Selector, email);

  const fbPasswordSelector = 'input[name="reg_passwd__"]';
  await fbPage.type(fbPasswordSelector, password);

  const fbBirthdaySelector = 'select[name="birthday_day"]';
  const fbBirthdaySelectElementHandle = await fbPage.$(fbBirthdaySelector);
  // Select the option by value or text
  await fbBirthdaySelectElementHandle.select('10');

  const fbMonthSelector = 'select[name="birthday_month"]';
  const fbMonthSelectElementHandle = await fbPage.$(fbMonthSelector);
  // Select the option by value or text
  await fbMonthSelectElementHandle.select('5');

  const fbYearSelector = 'select[name="birthday_year"]';
  const fbYearSelectElementHandle = await fbPage.$(fbYearSelector);
  await fbYearSelectElementHandle.select('1997');

  await fbPage.click('input[name="sex"]');

  const fbSignUpSelector = 'button[name="websubmit"]';
  await fbPage.click(fbSignUpSelector);

  const fbContinueSelector = 'div[aria-label="Continue"]';

  return { fbPage, waitFor };
}

const wrap = (s) => '{ return ' + s + ' };';

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
    url: 'https://signup.live.com/signup',
  });

  const signHotmailBody = `async function signHotmail({ fbPage, waitFor }) {
    const emailSelector = 'input[class="ltr_override form-control email-input-max-width"]';
    const email = 'alexgootvn12@hotmail.com';
    const password = 'BinhHuy@0605';
    const firstName = 'Huy';
    const lastName = 'Quang';
    await fbPage.waitForSelector(emailSelector, { timeout: 10000 });
    await fbPage.type(emailSelector, email);
    const buttonNextSelector = 'input[id="iSignupAction"]';
    await fbPage.click(buttonNextSelector, { timeout: 10000 });
    const passwordSelector = 'input[id="PasswordInput"]';
    await fbPage.waitForSelector(passwordSelector, { timeout: 10000 });
    await fbPage.type(passwordSelector, password);
    const buttonSignUpSelector = 'input[id="iSignupAction"]';
    await fbPage.click(buttonSignUpSelector, { timeout: 10000 });
    const firstNameSelector = 'input[id="FirstName"]';
    await fbPage.waitForSelector(firstNameSelector, { timeout: 10000 });
    await fbPage.type(firstNameSelector, 'Huy');
    const lastNameSelector = 'input[id="LastName"]';
    await fbPage.type(lastNameSelector, 'Quang');
    await fbPage.click(buttonNextSelector, { timeout: 10000 });
    const monthSelector = 'select[id="BirthMonth"]';
    const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const randomMonthIndex = Math.floor(Math.random() * 12) + 1;
    const randomMonth = months[randomMonthIndex - 1];
    await fbPage.waitForSelector(monthSelector, { timeout: 10000 });
    await fbPage.select(monthSelector, randomMonth);
    const daySelector = 'select[id="BirthDay"]';
    const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
    const randomDayIndex = Math.floor(Math.random() * 15) + 1;
    const randomDay = days[randomDayIndex - 1];
    await fbPage.waitForSelector(daySelector, { timeout: 10000 });
    await fbPage.select(daySelector, randomDay.toString());
    const yearSelector = 'input[id="BirthYear"]';
    const years = [
      '1988',
      '1989',
      '1990',
      '1991',
      '1992',
      '1993',
      '1994',
      '1995',
      '1996',
      '1997',
      '1998',
      '1999',
    ];
    const randomYearIndex = Math.floor(Math.random() * 12) + 1;
    const randomYear = years[randomYearIndex - 1];
    await fbPage.waitForSelector(yearSelector, { timeout: 10000 });
    await fbPage.type(yearSelector, randomYear.toString());
    await fbPage.waitForSelector(buttonNextSelector);
    await fbPage.click(buttonNextSelector);
    const iframeSelector = 'iframe[id="enforcementFrame"]'; // Adjust this selector based on your actual structure
    const iframe1Element = await fbPage.waitForSelector(iframeSelector);
    await waitFor(1000);
    const frame1 = await iframe1Element.contentFrame();
    console.log('wait frame1 done');
    const iframe2Selector = 'iframe[title="Verification challenge"]';
    const iframe2Element = await frame1.waitForSelector(iframe2Selector);
    await waitFor(1000);
    const frame2 = await iframe2Element.contentFrame();
    console.log('wait frame 2 done');
    const iframe3Selector = 'iframe[id="game-core-frame"]';
    const iframe3Element = await frame2.waitForSelector(iframe3Selector);
    await waitFor(1000);
    const frame3 = await iframe3Element.contentFrame();
    console.log('wait for frame 3 done');
    const buttonNextSelector2 = 'button[data-theme="home.verifyButton"]';
    await frame3.waitForSelector(buttonNextSelector2, { timeout: 30000 });
    await frame3.click(buttonNextSelector2);
    console.log('button clicked', fbPage, frame3);
    let capchaNumericalImageSelector = 'img[aria-label="Image 1 of 5."]';
    let capchaFingerSelector = 'img[aria-live="assertive"]';
    let capchaImageSelector = capchaNumericalImageSelector;
    let capchaType = 'numericalmatch';
  
    let isValidatingCapcha = true;
    while (isValidatingCapcha) {
      try {
        await frame3.waitForSelector(capchaNumericalImageSelector, { timeout: 3000 });
      } catch (error) {
        try {
          await frame3.waitForSelector(capchaFingerSelector, { timeout: 3000 });
          capchaImageSelector = capchaFingerSelector;
          capchaType = '3d_rollball_objects';
        } catch (error) {
          const [tryAgainButton] = await frame3.$x("//button[contains(., 'Try again')]");
          if (tryAgainButton) {
            tryAgainButton.click();
          } else {
            isValidatingCapcha = false;
            break;
          }
        }
      }
      console.log('captcha selector showed');
      const blob = await frame3.evaluate(async (selector) => {
        const element = document.querySelector(selector); // Get the background image URL after the image has loaded
        const style = window.getComputedStyle(element);
        console.log(style, style.backgroundImage);
        const imageUrl = style.backgroundImage.replace(/^url\(['"](.+)['"]\)/, '$1');
        const innerUrl = imageUrl
          .replaceAll('url', '')
          .replaceAll('"', '')
          .replaceAll('(', '')
          .replaceAll(')', '');
        const response = await fetch(innerUrl);
        console.log('huynvq::===========>', response);
        const buffer = await response.arrayBuffer();
        console.log('huynvq::===========>buffer', buffer);
        const base64String = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
        );
        return base64String;
      }, capchaImageSelector); // Check if there's a match and get the captured URL
      const decodedBuffer = Buffer.from(blob, 'base64');
      const recreatedBlob = new Blob([decodedBuffer], { type: 'application/octet-stream' });
      console.log('huynvq::==========>recreatedBlob', recreatedBlob);
      const formData = new FormData();
      formData.append('file', recreatedBlob);
      formData.append('method', 'post');
      formData.append('json', '1');
      formData.append('imginstructions', capchaType);
      formData.append('key', 'dbdb45911daf4743c2b1908bc788a413');
      const url = 'http://103.179.189.15:3000';
      try {
        const response = await fetch(url + '/in.php', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Request failed. Status ' + response.status);
        }
        const responseBody = await response.json();
        const { status, request } = responseBody;
        if (status == 1) {
          const responseSolve = await fetch(
            url + '/res.php?key=dbdb45911daf4743c2b1908bc788a413&action=get&json=1&id=' + request,
          );
          const responseSolveBody = await responseSolve.json();
  
          const nextImageSelector = 'a[aria-label="Navigate to next image"]';
          const step = Number(responseSolveBody.request);
          for (let i = 1; i < step; i++) {
            await frame3.click(nextImageSelector);
            await waitFor(500);
          }
  
          // Query the button within the iframe's document by its text content
          const [submitButton] = await frame3.$x("//button[contains(., 'Submit')]");
          if (submitButton) {
            submitButton.click();
          }
          console.log('huynvq::==============>responseSolveBody', responseSolveBody);
        }
      } catch (error) {
        console.error('Error sending request:', error.message);
      }
    }
    await waitFor(3000);
    await fbPage.goto('https://www.facebook.com/');
    const fbCreateAccountSelector = 'a[data-testid="open-registration-form-button"]';
    await fbPage.waitForSelector(fbCreateAccountSelector);
    await fbPage.click(fbCreateAccountSelector);
  
    const fbFirstNameSelecotr = 'input[name="firstname"]';
    await fbPage.waitForSelector(fbFirstNameSelecotr);
    await fbPage.type(fbFirstNameSelecotr, firstName);
  
    const fbLastNameSelector = 'input[name="lastname"]';
    await fbPage.type(fbLastNameSelector, lastName);
  
    const fbEmailSelector = 'input[name="reg_email__"]';
    await fbPage.type(fbEmailSelector, email);
  
    const fbEmail2Selector = 'input[name="reg_email_confirmation__"]';
    await fbPage.waitForSelector(fbEmail2Selector);
    await fbPage.type(fbLastNameSelector, email);
  
    const fbPasswordSelector = 'input[name="reg_passwd__"]';
    await fbPage.type(fbPasswordSelector, password);
  
    const fbBirthdaySelector = 'select[name="birthday_day"]';
    const fbBirthdaySelectElementHandle = await fbPage.$(fbBirthdaySelector);
    // Select the option by value or text
    await fbBirthdaySelectElementHandle.select('10');
  
    const fbMonthSelector = 'select[name="birthday_month"]';
    const fbMonthSelectElementHandle = await fbPage.$(fbMonthSelector);
    // Select the option by value or text
    await fbMonthSelectElementHandle.select('5');
  
    const fbYearSelector = 'select[name="birthday_year"]';
    const fbYearSelectElementHandle = await fbPage.$(fbYearSelector);
    await fbYearSelectElementHandle.select('1997');
  
    await fbPage.click('input[name="sex"]');
  
    const fbSignUpSelector = 'button[name="websubmit"]';
    await fbPage.click(fbSignUpSelector);
  
    return { fbPage, waitFor };
  }`;

  const executeSignup = new Function(wrap(signHotmailBody));

  await executeSignup.call(null).call(null, {
    fbPage,
    waitFor,
  });
})();
