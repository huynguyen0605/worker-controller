const upvote = (answerUrl) => {
  return `async function upvoteQuoraAnswer({ page, waitFor }) {
    await page.waitForSelector('#mainContent');
    await waitFor(3000);
    await page.goto(${answerUrl});
    await waitFor(3000);
    const upvoteButton = await page.evaluateHandle(() => {
      const xpathResult = document.evaluate("//button[contains(., 'Upvote')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const button = xpathResult.singleNodeValue;
      return button;
    });
    const upvoteButtonInfo = await page.evaluate(() => {
      const xpathResult = document.evaluate("//button[contains(., 'Upvote')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      const button = xpathResult.singleNodeValue;
      return button ? button.outerHTML : null;
    });
    if (upvoteButton.handle && !upvoteButtonInfo.includes("puppeteer_test_pressed")) {
      await upvoteButton.click();
    }
  }`;
};
module.exports = upvote;
