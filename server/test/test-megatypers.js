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
  fbPage.setViewport({ width: 1280, height: 900 });
  await fbPage.goto(url);
  return { browser, fbPage, waitFor };
}

const wrap = (s) => '{ return ' + s + ' };';

async function execMegatyper({ userInfo, fbPage, waitFor }) {
  const email = 'alexgootvn2@gmail.com';
  const password = 'Tthbnvqh@0605';
  const emailSelector = 'input[id="email"]';
  await fbPage.waitForSelector(emailSelector);
  await fbPage.type(emailSelector, email);
  const passwordSelector = 'input[id="password"]';
  await fbPage.type(passwordSelector, password);
  const loginButton = 'button[id="lgn"]';
  await fbPage.click(loginButton);
  const workSelector = 'a[href="/work/faster"]';
  await fbPage.waitForSelector(workSelector);
  await fbPage.goto('http://www.megatypers.com/work/faster');

  const inputSelector = 'input[id="dijit_form_TextBox_0"]';
  const btnSubmitSelector = 'span[id="dijit_form_Button_1_label"]';
  const captchaImageSelector = 'canvas[id="captcha_id"]';
  while (true) {
    await waitFor(2000);
    await fbPage.waitForSelector(captchaImageSelector, { timeout: 120000 });
    await waitFor(1000);
    const base64String = await fbPage.evaluate(async () => {
      const canvas = document.getElementById('captcha_id'); // Replace with your canvas ID
      const backgroundImageUrl = canvas.style.backgroundImage;
      console.log(backgroundImageUrl);
      const base64 = backgroundImageUrl
        .replace('url("data:image/jpeg;base64,', '')
        .replace('")', '');

      return base64;
    });
    console.log('base64String', base64String);
    const binaryString = atob(base64String);
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
    const recreatedBlob = new Blob([uint8Array], { type: 'image/jpeg' });
    console.log('huynvq::==========>recreatedBlob', recreatedBlob);
    const formData = new FormData();
    formData.append('file', recreatedBlob);
    formData.append('method', 'post');
    formData.append('phrase', '1');
    formData.append('json', '1');
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
        const text = responseSolveBody.request;
        console.log('huynvq::=====.text', text);
        await fbPage.type(inputSelector, text);
        await waitFor(1000);
        await fbPage.click(btnSubmitSelector);
      }
    } catch (error) {
      continue;
    }
  }
}

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
    url: 'http://www.megatypers.com/login',
  });

  const megatyperBody = `async function execMegatyper({ userInfo, fbPage, waitFor }) {
    const email = 'alexgootvn2@gmail.com';
    const password = 'Tthbnvqh@0605';
    const emailSelector = 'input[id="email"]';
    await fbPage.waitForSelector(emailSelector);
    await fbPage.type(emailSelector, email);
    const passwordSelector = 'input[id="password"]';
    await fbPage.type(passwordSelector, password);
    const loginButton = 'button[id="lgn"]';
    await fbPage.click(loginButton);
    const workSelector = 'a[href="/work/faster"]';
    await fbPage.waitForSelector(workSelector);
    await fbPage.goto('http://www.megatypers.com/work/faster');
  
    const inputSelector = 'input[id="dijit_form_TextBox_0"]';
    const btnSubmitSelector = 'span[id="dijit_form_Button_1_label"]';
    const captchaImageSelector = 'canvas[id="captcha_id"]';
    while (true) {
      await waitFor(2000);
      await fbPage.waitForSelector(captchaImageSelector, { timeout: 120000 });
      await waitFor(1000);
      const base64String = await fbPage.evaluate(async () => {
        const canvas = document.getElementById('captcha_id'); // Replace with your canvas ID
        const backgroundImageUrl = canvas.style.backgroundImage;
        console.log(backgroundImageUrl);
        const base64 = backgroundImageUrl
          .replace('url("data:image/jpeg;base64,', '')
          .replace('")', '');
  
        return base64;
      });
      console.log('base64String', base64String);
      const binaryString = atob(base64String);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }
      const recreatedBlob = new Blob([uint8Array], { type: 'image/jpeg' });
      console.log('huynvq::==========>recreatedBlob', recreatedBlob);
      const formData = new FormData();
      formData.append('file', recreatedBlob);
      formData.append('method', 'post');
      formData.append('phrase', '1');
      formData.append('json', '1');
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
          const text = responseSolveBody.request;
          console.log('huynvq::=====.text', text);
          await fbPage.type(inputSelector, text);
          await waitFor(1000);
          await fbPage.click(btnSubmitSelector);
        }
      } catch (error) {
        continue;
      }
    }
  }`;

  const executeMegatyper = new Function(wrap(megatyperBody));

  await executeMegatyper.call(null).call(null, {
    fbPage,
    waitFor,
  });
})();
