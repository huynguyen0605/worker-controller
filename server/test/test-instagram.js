async function init({ chromePath, url, proxyServer }) {
  const puppeteer = await import('puppeteer');
  const proxyChain = await import('proxy-chain');
  const axios = await import('axios');

  const waitFor = async (time) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  };

  const oldProxyUrl = 'http://rsjfyami:y1psgav7cwfd@185.199.228.220:7300';
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    args: [`--incognito`, `--proxy-server=${newProxyUrl}`],
  });
  // const context = await browser.createIncognitoBrowserContext();
  // const fbPage = await context.newPage();
  const fbPage = await browser.newPage();
  // await fbPage.authenticate('rsjfyami', 'y1psgav7cwfd');
  fbPage.setViewport({ width: 1280, height: 800 });
  await fbPage.goto(url);
  return { browser, fbPage, waitFor };
}

(async () => {
  const { fbPage, waitFor } = await init({
    chromePath: 'C://Program Files/Google/Chrome/Application/chrome.exe',
    url: 'https://iphey.com',
    proxyServer: 'http://rsjfyami:y1psgav7cwfd@38.154.227.167:5868',
  });

  fbPage.
})();
