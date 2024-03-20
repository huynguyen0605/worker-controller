const { mappings, actionConnector, actionConnector2, promotions } = require('./word-definitions');
const removeDiacritics = require('./remove-diacritics');
const getMatchMapping = (content) => {
  let matchedMappings = [];
  for (const mapping of mappings) {
    for (const keyword of mapping.keywords) {
      if (content.toLowerCase().includes(keyword)) {
        matchedMappings.push(mapping);
        break;
      }
    }
  }

  if (matchedMappings.length <= 1) {
    return matchedMappings;
  } else {
    return matchedMappings.slice(0, 2);
  }
};

const getRandomElementFromArray = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const buildSubject = (mappings) => {
  let result = '';
  //1 means no starter
  //2 means no middle
  const type = getRandomElementFromArray([1, 2]);

  const { starter, middle } = mappings[0];
  let subjectStarter = '';
  if (type != 1) subjectStarter = getRandomElementFromArray(starter);
  let subjectMiddle = '';
  if (type != 2) subjectMiddle = getRandomElementFromArray(middle);
  if (subjectStarter !== '') result += subjectStarter;
  if (subjectMiddle !== '') result += subjectMiddle;

  return result;
};

const buildActions = (mappings) => {
  let allActions = [];
  for (const mapping of mappings) {
    const { actions } = mapping;
    let realAction = getRandomElementFromArray(actions);
    allActions.push(realAction);
  }
  let contentAction = ' ';
  for (let i = 0; i < allActions.length; i++) {
    let action = allActions[i];
    contentAction += action;
    if (allActions.length == 1) {
    } else if (i == 0) {
      contentAction += ' ' + getRandomElementFromArray(actionConnector) + ' ';
    } else if (i == allActions.length - 1) {
      contentAction += '.';
    } else {
      contentAction += ' ' + getRandomElementFromArray(actionConnector2) + ' ';
    }
  }
  return contentAction;
};

const buildProductDescription = (mappings) => {
  let contentProductDescription = `. ${getRandomElementFromArray(
    mappings[0].productDescription,
  )}. `;
  for (const mapping of mappings) {
    const { productMap } = mapping;
    for (const key of Object.keys(productMap)) {
      contentProductDescription += `${key}: ${productMap[key]} `;
    }
  }
  return contentProductDescription;
};
const buildContentAnswer = (mappings) => {
  // const { description, keywords, starter, middle, productDescription, actions, productMap } = {};
  let answer = '';
  const subject = buildSubject(mappings);
  const action = buildActions(mappings);
  const productDescription = buildProductDescription(mappings);
  answer += `${subject}${action}${productDescription}`;

  return answer;
};

const analyzeContent = (htmlContent) => {
  const content = removeDiacritics(htmlContent.replace(/<[^>]*>/g, ''));
  const mappings = getMatchMapping(content);
  if (mappings.length === 0) {
    return getRandomElementFromArray(promotions);
  }
  const answer = buildContentAnswer(mappings);
  return answer;
};

(() => {
  const htmlContent =
    '<div><div class="" dir="auto"><div class="x1iorvi4 x1pi30zi x1swvt13 xjkvuk6" data-ad-comet-preview="message" data-ad-preview="message" id=":r2d:"><div class="x78zum5 xdt5ytf xz62fqu x16ldp7u"><div class="xu06os2 x1ok221b"><span class="x193iq5w xeuugli x13faqbe x1vvkbs x1xmvt09 x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x xudqn12 x3x7a5m x6prxxf xvq8zen xo1l8bm xzsf02u x1yc453h" dir="auto"><div class="xdj266r x11i5rnm xat24cr x1mh8g0r x1vvkbs x126k92a"><div dir="auto" style="text-align: start;">Các mom cho e hỏi .  </div><div dir="auto" style="text-align: start;">Bé ti mẹ trực tiếp không vắt sữa nhưng mẹ ít sữa thì phải làm thế nào để sữa về ạ <span class="x3nfvp2 x1j61x8r x1fcty0u xdj266r xhhsvwb xat24cr xgzva0m xxymvpz xlup9mm x1kky2od"><img height="16" width="16" alt="😭" class="xz74otr" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t40/1/16/1f62d.png"></span><span class="x3nfvp2 x1j61x8r x1fcty0u xdj266r xhhsvwb xat24cr xgzva0m xxymvpz xlup9mm x1kky2od"><img height="16" width="16" alt="😭" class="xz74otr" referrerpolicy="origin-when-cross-origin" src="https://static.xx.fbcdn.net/images/emoji.php/v9/t40/1/16/1f62d.png"></span></div></div></span></div></div></div></div></div>';

  const kw = analyzeContent(htmlContent);
  console.log('content', kw);
})();
module.exports = analyzeContent;
