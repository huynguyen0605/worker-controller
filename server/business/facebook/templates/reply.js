const reply = (questionUrl, answer) => {
  return `async function commentPostFacebook({ page, browser, waitFor, userId, userPass, user2fa }) {
    try {
      await page.goto(\`${questionUrl}\`);
      await waitFor(2000);
      const inputCommentSelector =
        'div[contenteditable="true"][spellcheck="true"]';
      const inputComment = await page.$(inputCommentSelector);
      await inputComment.type(\`${answer}\`);
      await waitFor(2000);
      const submitBtn = await page.$("#focused-state-composer-submit");
      await submitBtn.click();
      await waitFor(20000);
      await page.waitForSelector(
        'div[aria-label="Chỉnh sửa hoặc xóa bình luận này"], div[aria-label="Edit or delete this"]'
      );
      await page.click(
        'div[aria-label="Chỉnh sửa hoặc xóa bình luận này"], div[aria-label="Edit or delete this"]'
      );
      const menuItem = await page.waitForSelector('div[role="menuitem"]');
      await menuItem.click();
      await waitFor(5000);
      await page.keyboard.down("Control");
      await page.keyboard.press("KeyA");
      await page.keyboard.up("Control");
      await page.keyboard.type(\`${answer}\`);
      await page.keyboard.press("Enter");
      await waitFor(10000);
    } catch (error) {
      console.log("========> error: ", error.message);
    }
  }`;
};
module.exports = reply;
