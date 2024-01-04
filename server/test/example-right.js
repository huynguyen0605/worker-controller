async function signHotmail({ fbPage, waitFor }) {
  const emailSelector = 'input[class="ltr_override form-control email-input-max-width"]';
  await fbPage.waitForSelector(emailSelector, { timeout: 5000 });
  await fbPage.type(emailSelector, 'alexgootvn2@hotmail.com');
  const buttonNextSelector = 'input[id="iSignupAction"]';
  await fbPage.click(buttonNextSelector, { timeout: 5000 });
  const passwordSelector = 'input[id="PasswordInput"]';
  await fbPage.waitForSelector(passwordSelector, { timeout: 5000 });
  await fbPage.type(passwordSelector, 'BinhHuy@0605');
  const buttonSignUpSelector = 'input[id="iSignupAction"]';
  await fbPage.click(buttonSignUpSelector, { timeout: 5000 });
  const firstNameSelector = 'input[id="FirstName"]';
  await fbPage.waitForSelector(firstNameSelector, { timeout: 5000 });
  await fbPage.type(firstNameSelector, 'Huy');
  const lastNameSelector = 'input[id="LastName"]';
  await fbPage.type(lastNameSelector, 'Quang');
  await fbPage.click(buttonNextSelector, { timeout: 5000 });
  const monthSelector = 'select[id="BirthMonth"]';
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const randomMonthIndex = Math.floor(Math.random() * 12) + 1;
  const randomMonth = months[randomMonthIndex - 1];
  await fbPage.waitForSelector(monthSelector, { timeout: 5000 });
  await fbPage.select(monthSelector, randomMonth);
  const daySelector = 'select[id="BirthDay"]';
  const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
  const randomDayIndex = Math.floor(Math.random() * 15) + 1;
  const randomDay = days[randomDayIndex - 1];
  await fbPage.waitForSelector(daySelector, { timeout: 5000 });
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
  await fbPage.waitForSelector(yearSelector, { timeout: 5000 });
  await fbPage.type(yearSelector, randomYear.toString());
  await fbPage.waitForSelector(buttonNextSelector);
  await fbPage.click(buttonNextSelector);
  const iframeSelector = 'iframe[id="enforcementFrame"]'; // Adjust this selector based on your actual structure
  const iframeElement = await fbPage.waitForSelector(iframeSelector);
  console.log('wait frame1 done');
  const iframe2Selector = 'iframe[title="Verification challenge"]';
  const iframe2Element = await frame.waitForSelector(iframe2Selector);
  const frame2 = await iframe2Element.contentFrame();
  console.log('wait frame 2 done');
  const iframe3Selector = 'iframe[id="game-core-frame"]';
  const iframe3Element = await frame2.waitForSelector(iframe3Selector);
  const frame3 = await iframe3Element.contentFrame();
  console.log('wait for frame 3 done');
  const buttonNextSelector2 = 'button[data-theme="home.verifyButton"]';
  await frame3.waitForSelector(buttonNextSelector2, { timeout: 30000 });
  await waitFor(3000);
  await frame3.click(buttonNextSelector2);
  console.log('button clicked', fbPage, frame3);

  /** start solving captcha */
  const capchaImageSelector = 'img[aria-label="Image 1 of 5."]';
  await frame3.waitForSelector(capchaImageSelector, { timeout: 300000 });
  console.log('captcha selector showed');
  const blob = await frame3.evaluate(async (selector) => {
    const element = document.querySelector(selector);
    // Get the background image URL after the image has loaded
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
  }, capchaImageSelector);
  // Check if there's a match and get the captured URL

  const decodedBuffer = Buffer.from(blob, 'base64');
  const recreatedBlob = new Blob([decodedBuffer], { type: 'application/octet-stream' });
  console.log('huynvq::==========>recreatedBlob', recreatedBlob);

  const formData = new FormData();

  formData.append('file', recreatedBlob);
  formData.append('method', 'post');
  formData.append('json', '1');
  formData.append('imginstructions', 'numericalmatch');
  formData.append('key', 'cb65b8ed149b70ce7993d142c9e08873');

  try {
    const response = await fetch('http://103.82.22.245:80/in.php', {
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
        'http://103.82.22.245:80/res.php?key=cb65b8ed149b70ce7993d142c9e08873&action=get&json=1&id=' +
          request,
      );
      const responseSolveBody = await responseSolve.json();
      console.log('huynvq::==============>responseSolveBody', responseSolveBody);
    }
    console.log('Server response:', responseBody);
  } catch (error) {
    console.error('Error sending request:', error.message);
  }

  return { fbPage, waitFor };
}
