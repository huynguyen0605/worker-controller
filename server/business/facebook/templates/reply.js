const reply = (questionUrl, answer) => {
  return `async function commentPostFacebook({
    page,
    browser,
    waitFor,
    userId,
    userPass,
    user2fa,
  }) {
    try {
      await page.goto(\`${questionUrl}\`);
      await waitFor(2000);
      const inputCommentSelector = 'div[contenteditable="true"][spellcheck="true"]';
      const inputComment = await page.$(inputCommentSelector);
      await inputComment.type(\`${answer}\`);
      await waitFor(2000);
      const submitBtn = await page.$('#focused-state-composer-submit');
      await submitBtn.click();
      await waitFor(30000);
    } catch (error) {
      console.log('========> error: ', error);
    }
  }`;
};

module.exports = reply;
