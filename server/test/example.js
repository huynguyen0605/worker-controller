while (true) {
  await waitFor(1000);
  await fbPage.waitForSelector(captchaImageSelector);
  await waitFor(1000);
  const base64String = await fbPage.evaluate(async () => {
    const canvas = document.getElementById('captcha_id'); // Replace with your canvas ID
    const backgroundImageUrl = canvas.style.backgroundImage;
    console.log(backgroundImageUrl);

    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );

    return base64;
  });
  console.log('base64String', base64String);
  const decodedBuffer = Buffer.from(base64String, 'base64');
  const recreatedBlob = new Blob([decodedBuffer], { type: 'application/octet-stream' });
  console.log('huynvq::==========>recreatedBlob', recreatedBlob);
  const formData = new FormData();
  formData.append('file', recreatedBlob);
  formData.append('method', 'post');
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
      await waitFor(500);
      await fbPage.click(btnSubmitSelector);
    }
  } catch (error) {
    continue;
  }
}
