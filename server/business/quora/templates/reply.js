const reply = (questionUrl, answer) => {
  return `async function replyQuoraQuestion({ page, waitFor }) {
    await page.waitForSelector('#mainContent');
    await waitFor(3000);
    await page.goto('${questionUrl}');
    await waitFor(3000);
    const handleReply = async (editBtn, hasDelete) => {
      await editBtn.click();
      const elementHandle = await page.waitForSelector('[data-placeholder="Write your answer"]');
      if (hasDelete) {
        await elementHandle.click({ clickCount: 3 });
        await elementHandle.press('Backspace');
      }
      await elementHandle.type('${answer}');
      const submitBtn = await page.evaluateHandle(() => {
        const xpathResult = document.evaluate(
          "//button[contains(., 'Post')]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        );
        const button = xpathResult.singleNodeValue;
        return button;
      });
      if (submitBtn.handle) await submitBtn.click();
      const doneBtn = await page.evaluateHandle(() => {
        const xpathResult = document.evaluate(
          "//button[contains(., 'Done')]",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        );
        const button = xpathResult.singleNodeValue;
        return button;
      });
      if (doneBtn.handle) await doneBtn.click();
    };
    const answerButton = await page.evaluateHandle(() => {
      const xpathResult = document.evaluate(
        "//button[contains(., 'Answer')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      const button = xpathResult.singleNodeValue;
      return button;
    });
    const editDraftButton = await page.evaluateHandle(() => {
      const xpathResult = document.evaluate(
        "//button[contains(., 'Edit draft')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      const button = xpathResult.singleNodeValue;
      return button;
    });
    if (answerButton.handle) {
      handleReply(answerButton, false);
    } else if (editDraftButton.handle) {
      handleReply(editDraftButton, true);
    }
    await waitFor(5000);
    const url = await page.url();
  }`;
};

module.exports = reply;
